const express = require("express");
const { forgotPassword, resetPassword, getUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Get Users");
});

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/profile", protect, getUserProfile);

module.exports = router;