const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getAllReviews,
  deleteReview,
} = require("../controllers/productController");

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getProducts);

// Admin review moderation routes (placed above /:id to avoid parameter collision)
router.get("/reviews/all", protect, admin, getAllReviews);
router.delete("/reviews/:id", protect, admin, deleteReview);

router.get("/:id", getProductById);

router.post("/", protect, admin, createProduct);

router.put("/:id", protect, admin, updateProduct);

router.delete("/:id", protect, admin, deleteProduct);

router.post("/:id/reviews", protect, createProductReview);

module.exports = router;