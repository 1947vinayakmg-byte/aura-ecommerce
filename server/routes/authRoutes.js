const { protect } = require("../middleware/authMiddleware");
const express = require("express");

const {
  registerUser,
  loginUser,
  getUserProfile,
  googleLogin,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/google", googleLogin);

router.get("/profile", protect, getUserProfile);

// Password recovery
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

module.exports = router;
