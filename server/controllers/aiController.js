const { GoogleGenAI } = require("@google/genai");
const Order = require("../models/orderModel");
const Product = require("../models/Product");
const User = require("../models/User");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateInsights = async (req, res) => {
  try {
    // ── Fetch real live data from the database ──
    const [totalOrders, totalUsers, allProductsRaw] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Product.find({ isHidden: { $ne: true } }).lean()
    ]);

    const allProducts = allProductsRaw;

    // Revenue from non-cancelled orders
    const activeOrders = await Order.find({ status: { $ne: "Cancelled" } })
      .populate("orderItems.product", "name category")
      .populate("user", "name")
      .lean();

    const totalRevenue = activeOrders.reduce((acc, o) => acc + o.totalPrice, 0);
    const avgOrderValue = activeOrders.length > 0 ? Math.round(totalRevenue / activeOrders.length) : 0;

    // Payment split
    const onlineOrders = activeOrders.filter(o => o.paymentMethod?.toUpperCase() !== "COD").length;
    const codOrders = activeOrders.filter(o => o.paymentMethod?.toUpperCase() === "COD").length;

    // Low stock products
    const lowStockProducts = allProducts
      .filter(p => p.countInStock <= 10)
      .map(p => ({ name: p.name, stock: p.countInStock, category: p.category }));

    // Out of stock
    const outOfStockCount = allProducts.filter(p => p.countInStock === 0).length;

    // Top categories by product count
    const categoryCount = {};
    allProducts.forEach(p => {
      const cat = p.category || "Uncategorized";
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    // Top selling products from orders
    const productSalesMap = {};
    activeOrders.forEach(o => {
      o.orderItems.forEach(item => {
        const name = item.name || (item.product && item.product.name) || "Unknown";
        if (!productSalesMap[name]) productSalesMap[name] = { qty: 0, revenue: 0 };
        productSalesMap[name].qty += item.qty;
        productSalesMap[name].revenue += item.price * item.qty;
      });
    });

    const topProducts = Object.entries(productSalesMap)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5)
      .map(([name, stats]) => ({ name, ...stats }));

    // Recent order trend (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentOrderCount = activeOrders.filter(o => new Date(o.createdAt) >= sevenDaysAgo).length;

    // ── Build the Gemini Prompt with real data ──
    const prompt = `
You are an elite luxury fashion business analyst for AURA Maison de Luxe — a premium Indian luxury e-commerce brand.

Here is the LIVE real-time business intelligence data for today:

EXECUTIVE SUMMARY:
- Total Orders Placed: ${totalOrders}
- Active (Non-Cancelled) Orders: ${activeOrders.length}
- Total Gross Revenue: ₹${totalRevenue.toLocaleString()}
- Average Order Value (AOV): ₹${avgOrderValue.toLocaleString()}
- Total Registered Customers: ${totalUsers}
- Orders in Last 7 Days: ${recentOrderCount}
- Online Payments: ${onlineOrders} | COD Orders: ${codOrders}
- Total Product Catalog Size: ${allProducts.length}
- Out of Stock Products: ${outOfStockCount}

TOP SELLING MASTERPIECES (by revenue):
${topProducts.map((p, i) => `${i + 1}. ${p.name} — ${p.qty} units sold — ₹${p.revenue.toLocaleString()} revenue`).join("\n")}

LOW / CRITICAL STOCK ALERTS:
${lowStockProducts.length === 0 ? "All products are sufficiently stocked." : lowStockProducts.slice(0, 8).map(p => `- ${p.name} (${p.category}): ${p.stock} units remaining`).join("\n")}

COLLECTION PORTFOLIO:
${Object.entries(categoryCount).map(([cat, count]) => `- ${cat}: ${count} products`).join("\n")}

Based on this real data, provide a comprehensive executive intelligence briefing structured into exactly these 5 sections using this exact format:

## MARKET TRENDS
[Analyze current order velocity, AOV trajectory, payment preference trends, and what this means for the luxury segment]

## INVENTORY INTELLIGENCE
[Identify which products and categories are at risk, which are overperforming, and give specific restocking recommendations]

## CUSTOMER INTELLIGENCE
[Analyze the customer base size, COD vs online ratio as a trust indicator, and recommend loyalty/retention strategies]

## REVENUE OPTIMIZATION
[Specific actionable strategies to increase revenue — upselling, bundling, pricing adjustments based on the data above]

## EXECUTIVE ACTION PLAN
[A prioritized list of the top 5 concrete actions the Store Director should take this week based on the data]

Be specific, use the actual numbers from the data, and write in a premium luxury brand tone. Do NOT use generic advice — reference actual product names, revenue figures, and specific metrics from the data provided.
    `.trim();

    console.log("AI Insight: Built prompt, calling Gemini API...");
    
    // ── Call Gemini API ──
    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
    });
    const text = response.text;
    
    console.log("AI Insight: Received response from Gemini");

    res.json({ insights: text, generatedAt: new Date().toISOString() });

  } catch (error) {
    console.error("AI Insight generation failed with error object:", error);
    res.status(500).json({ message: "AI insight generation failed: " + error.message, error: error.message });
  }
};

module.exports = { generateInsights };
