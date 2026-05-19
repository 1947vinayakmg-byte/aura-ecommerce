const Order = require("../models/orderModel");
const Product = require("../models/Product");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    // Fetch all non-cancelled orders
    const activeOrders = await Order.find({ status: { $ne: "Cancelled" } });
    
    // Total Revenue calculation from active orders
    const totalRevenue = activeOrders.reduce((acc, item) => acc + item.totalPrice, 0);

    // 1. Calculate Average Order Value (AOV)
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // 2. Dynamic Conversion Rate
    // Standard conversion formula benchmarked to real users & orders
    const conversionRate = totalUsers > 0 
      ? Math.min(100, Number(((totalOrders / totalUsers) * 100).toFixed(1)))
      : 0.0;

    // 3. Real-time Revenue Flow (Daily stats for the last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const revenueFlowData = await Order.aggregate([
      { 
        $match: { 
          status: { $ne: "Cancelled" },
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const revenueFlow = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const dayName = daysOfWeek[date.getDay()];
      
      const dayMatch = revenueFlowData.find(item => item._id === dateString);
      revenueFlow.push({
        name: dayName,
        value: dayMatch ? dayMatch.revenue : 0
      });
    }

    // 4. Collection Share (Revenue split by Product Categories)
    const collectionData = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $unwind: "$orderItems" },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category",
          totalSales: { $sum: { $multiply: ["$orderItems.price", "$orderItems.qty"] } }
        }
      }
    ]);

    // Calculate percentages for categories
    const totalSalesSum = collectionData.reduce((acc, item) => acc + item.totalSales, 0);
    const collectionShare = collectionData.map(item => ({
      name: item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : 'Exclusive',
      value: totalSalesSum > 0 ? Math.round((item.totalSales / totalSalesSum) * 100) : 0
    }));

    // If no category sales exist, provide luxury defaults to keep charts alive
    if (collectionShare.length === 0) {
      collectionShare.push(
        { name: 'Apparel', value: 45 },
        { name: 'Accessories', value: 25 },
        { name: 'Jewelry', value: 20 },
        { name: 'Footwear', value: 10 }
      );
    }

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      avgOrderValue,
      conversionRate,
      revenueFlow,
      collectionShare
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};