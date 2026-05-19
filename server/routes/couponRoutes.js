const express = require("express");
const router = express.Router();

const {
  applyCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");

const { protect, admin } = require("../middleware/authMiddleware");

// Public / client route
router.post("/apply", applyCoupon);

// Admin routes
router.get("/", protect, admin, getCoupons);
router.post("/", protect, admin, createCoupon);
router.put("/:id", protect, admin, updateCoupon);
router.delete("/:id", protect, admin, deleteCoupon);

module.exports = router;