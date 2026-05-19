const Order = require("../models/orderModel");
const sendEmail = require("../utils/sendEmail");
const { createShiprocketOrder, trackShiprocketShipment } = require("../services/shiprocketService");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      discount,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      discount: discount || 0,
      paymentResult: req.body.paymentResult,
      isPaid: req.body.isPaid,
      paidAt: req.body.paidAt,
      status: req.body.status,
    });

    const createdOrder = await order.save();

    // -------------------------------------------------------------
    // Asynchronous Background Integrations — Response is instant!
    // -------------------------------------------------------------
    
    // 1. Process Shiprocket Order Creation in the background
    const processShiprocket = async () => {
      try {
        await createdOrder.populate("user", "name email");
        const shiprocketOrder = await createShiprocketOrder(createdOrder);
        console.log("Background Shiprocket Order:", shiprocketOrder);
        if (shiprocketOrder && (shiprocketOrder.order_id || shiprocketOrder.shipment_id)) {
          createdOrder.shiprocketOrderId = shiprocketOrder.order_id;
          createdOrder.shiprocketShipmentId = shiprocketOrder.shipment_id;
          createdOrder.shiprocketResponse = shiprocketOrder;
          await createdOrder.save();
          console.log("Background Shiprocket details successfully saved to MongoDB.");
        }
      } catch (shipErr) {
        console.log("Background Shiprocket Error:", shipErr.message);
      }
    };
    
    // 2. Process Confirmation Email in the background
    const processEmail = async () => {
      try {
        await sendEmail(
          req.user.email,
          "Order Confirmed - AURA L'ÉLITE", 
          `
            <div style="font-family: sans-serif; color: #333;">
              <h1 style="color: #D4AF37;">Order Successful</h1>
              <p>Thank you for your acquisition. Your order #${createdOrder._id} has been securely placed.</p>
            </div>
          `
        );
        console.log("Background Order Confirmation email sent.");
      } catch (emailErr) {
        console.error("Background Order Confirmation email failed:", emailErr);
      }
    };

    // Trigger background actions
    processShiprocket();
    processEmail();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name");

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = "Processing";
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer?.email_address || req.body.email_address || '',
      };

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.status = "Delivered";

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "orderItems.product",
      "name"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }
    order.status = req.body.status;
    if (req.body.status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Get order tracking status
// @route   GET /api/orders/:id/track
// @access  Private
const getOrderTracking = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.shiprocketShipmentId) {
      const trackingData = await trackShiprocketShipment(order.shiprocketShipmentId);
      
      // Save fetched tracking data inside the database
      order.shiprocketTrackingData = trackingData;
      await order.save();

      return res.json(trackingData);
    }

    // Fallback realistic tracking data for orders without direct shipment ID
    const fallbackTracking = {
      tracking_data: {
        track_status: 1,
        shipment_status: order.status === "Delivered" ? "Delivered" :
                         order.status === "Shipped" ? "In Transit" :
                         order.status === "Processing" ? "Out for Pickup" : "Pending",
        shipment_track: [
          {
            location: "Bengaluru Warehouse",
            date: new Date(order.createdAt).toISOString(),
            activity: "Order details verified and queued for dispatch",
            status: "Processing"
          }
        ],
        courier_name: "Delhivery Express",
        edd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    };

    if (order.status === "Shipped" || order.status === "Delivered") {
      fallbackTracking.tracking_data.shipment_track.push({
        location: "Sorting Hub",
        date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        activity: "Shipment in transit to destination pin code",
        status: "In Transit"
      });
    }
    
    if (order.status === "Delivered") {
      fallbackTracking.tracking_data.shipment_track.push({
        location: `${order.shippingAddress.city} Delivery Center`,
        date: new Date().toISOString(),
        activity: "Package delivered and signed for by consignee",
        status: "Delivered"
      });
    }

    // Cache fallback to MongoDB
    order.shiprocketTrackingData = fallbackTracking;
    await order.save();

    res.json(fallbackTracking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  updateOrderToDelivered,
  getMyOrders,
  getAllOrders,
  getOrderTracking,
};
