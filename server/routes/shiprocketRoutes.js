const express = require("express");
const router = express.Router();
const { getShiprocketToken, trackShiprocketShipment: trackShipment } = require("../services/shiprocketService");

router.get("/shiprocket-test", async (req, res) => {
  try {
    const token = await getShiprocketToken();
    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve authentication token from Shiprocket. Please check your SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD environment variables.",
      });
    }

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("Shiprocket Auth Test Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error occurred while requesting Shiprocket credentials.",
      error: error.message,
    });
  }
});

router.get(
  "/track/:shipmentId",
  async (req, res) => {
    try {
      const tracking = await trackShipment(req.params.shipmentId);
      res.json(tracking);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;