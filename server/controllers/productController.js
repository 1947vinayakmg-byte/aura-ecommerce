const Product = require("../models/Product");
const Order = require("../models/orderModel");

const getProducts = async (req, res) => {
  try {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const category = req.query.category
      ? {
          category: req.query.category,
        }
      : {};

    const hiddenFilter = req.query.hidden === 'true' 
      ? { isHidden: true } 
      : { isHidden: { $ne: true } };

    const filter = {
      ...keyword,
      ...category,
      ...hiddenFilter
    };

    const count = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .lean();

    const salesData = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $unwind: "$orderItems" },
      { $group: {
          _id: "$orderItems.product",
          totalSold: { $sum: "$orderItems.qty" },
          totalRevenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.qty"] } }
        }
      }
    ]);

    const salesMap = {};
    salesData.forEach(item => {
      if (item._id) {
        salesMap[item._id.toString()] = {
          totalSold: item.totalSold,
          totalRevenue: item.totalRevenue
        };
      }
    });

    const productsWithSales = products.map(p => {
      const sales = salesMap[p._id.toString()] || { totalSold: 0, totalRevenue: 0 };
      return {
        ...p,
        totalSold: sales.totalSold,
        totalRevenue: sales.totalRevenue
      };
    });

    res.json({
      products: productsWithSales,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (product) {
      const orders = await Order.find({
        "orderItems.product": req.params.id,
        status: { $ne: "Cancelled" }
      }).populate("user", "name email").sort({ createdAt: -1 });

      let totalSold = 0;
      let totalRevenue = 0;
      let last30DaysSold = 0;
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const recentOrders = [];

      orders.forEach(order => {
        const item = order.orderItems.find(i => i.product.toString() === req.params.id.toString());
        if (item) {
          totalSold += item.qty;
          totalRevenue += (item.price * item.qty);
          if (new Date(order.createdAt) >= thirtyDaysAgo) {
            last30DaysSold += item.qty;
          }
          recentOrders.push({
            _id: order._id,
            user: order.user,
            qty: item.qty,
            price: item.price,
            total: item.price * item.qty,
            status: order.status,
            createdAt: order.createdAt
          });
        }
      });

      res.json({
        ...product,
        totalSold,
        totalRevenue,
        last30DaysSold,
        recentOrders
      });
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.isHidden = true;
      await product.save();

      res.json({
        message: "Product removed from storefront",
      });
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name !== undefined ? req.body.name : product.name;
      product.description = req.body.description !== undefined ? req.body.description : product.description;
      product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
      product.image = req.body.image !== undefined ? req.body.image : product.image;
      product.images = req.body.images !== undefined ? req.body.images : product.images;
      product.category = req.body.category !== undefined ? req.body.category : product.category;
      product.brand = req.body.brand !== undefined ? req.body.brand : product.brand;
      product.countInStock = req.body.countInStock !== undefined ? Number(req.body.countInStock) : product.countInStock;
      product.sizes = req.body.sizes !== undefined ? req.body.sizes : product.sizes;
      product.colors = req.body.colors !== undefined ? req.body.colors : product.colors;
      product.isTrending = req.body.isTrending !== undefined ? req.body.isTrending : product.isTrending;
      product.isNewProduct = req.body.isNewProduct !== undefined ? req.body.isNewProduct : product.isNewProduct;
      product.isHidden = req.body.isHidden !== undefined ? req.body.isHidden : product.isHidden;

      const updatedProduct = await product.save();

      res.json(updatedProduct);
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
  name,
  description,
  price,
  image,
  images,
  category,
  brand,
  colors,
  sizes,
  countInStock,
  isTrending,
  isNewProduct,
} = req.body;

   const product = await Product.create({
  name,
  description,
  price,
  image,
  images,
  category,
  brand,
  colors,
  sizes,
  countInStock,
  isTrending,
  isNewProduct,
});

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Already reviewed" });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({ message: "Review added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const products = await Product.find({}, "name image reviews").lean();
    let allReviews = [];
    
    products.forEach((p) => {
      if (p.reviews && p.reviews.length > 0) {
        p.reviews.forEach((r) => {
          allReviews.push({
            _id: r._id,
            name: r.name,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt,
            product: {
              _id: p._id,
              name: p.name,
              image: p.image || (p.images && p.images[0]),
            },
          });
        });
      }
    });

    // Sort by newest first
    allReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json(allReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params; // review ID
    const product = await Product.findOne({ "reviews._id": id });

    if (!product) {
      return res.status(404).json({ message: "Review not found or product deleted" });
    }

    product.reviews = product.reviews.filter((r) => r._id.toString() !== id.toString());
    product.numReviews = product.reviews.length;

    if (product.reviews.length > 0) {
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  createProductReview,
  getAllReviews,
  deleteReview,
};