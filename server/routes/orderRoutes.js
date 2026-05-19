const express =
  require("express");

const router =
  express.Router();

const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  updateOrderToDelivered,
  getMyOrders,
  getAllOrders,
  getOrderTracking,
} = require(
  "../controllers/orderController"
);

const {
  protect,
  admin,
} = require(
  "../middleware/authMiddleware"
);

router.post(
  "/",
  protect,
  createOrder
);

router.get(
  "/all",
  protect,
  admin,
  getAllOrders
);

router.get(
  "/myorders",
  protect,
  getMyOrders
);

router.get(
  "/:id",
  protect,
  getOrderById
);

router.get(
  "/:id/track",
  protect,
  getOrderTracking
);

router.put(
  "/:id/pay",
  protect,
  updateOrderToPaid
);

router.put(
  "/:id/deliver",
  protect,
  admin,
  updateOrderToDelivered
);

router.put(
  "/:id/status",
  protect,
  admin,
  updateOrderStatus
);

module.exports =
  router;