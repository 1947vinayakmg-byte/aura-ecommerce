const express = require("express");
const router = express.Router();
const { generateInsights } = require("../controllers/aiController");
const { protect, admin } = require("../middleware/authMiddleware");

// POST /api/ai/insights — Generate real-time AI executive briefing (Admin only)
router.post("/insights", protect, admin, generateInsights);

// Unprotected for local testing
router.post("/insights-test", generateInsights);

module.exports = router;
