const Coupon =
  require("../models/Coupon");

const applyCoupon =
  async (req, res) => {

    try {

      const code = req.body.code ? req.body.code.trim().toUpperCase() : "";

      const coupon =
        await Coupon.findOne({
          code,
        });

      if (!coupon) {

        return res
          .status(404)
          .json({
            message:
              "Invalid coupon",
          });
      }

      if (
        new Date() >
        coupon.expireAt
      ) {

        return res
          .status(400)
          .json({
            message:
              "Coupon expired",
          });
      }

      res.json({
        discount:
          coupon.discount,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  try {
    const { code, discount, expireAt } = req.body;

    if (!code || discount === undefined || !expireAt) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const uppercaseCode = code.trim().toUpperCase();

    const couponExists = await Coupon.findOne({ code: uppercaseCode });
    if (couponExists) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = new Coupon({
      code: uppercaseCode,
      discount,
      expireAt,
    });

    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
  try {
    const { code, discount, expireAt } = req.body;
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (code) {
      const uppercaseCode = code.trim().toUpperCase();
      // Check if another coupon has the same code
      const duplicate = await Coupon.findOne({ code: uppercaseCode, _id: { $ne: req.params.id } });
      if (duplicate) {
        return res.status(400).json({ message: "Coupon code already exists" });
      }
      coupon.code = uppercaseCode;
    }

    if (discount !== undefined) {
      coupon.discount = discount;
    }

    if (expireAt) {
      coupon.expireAt = expireAt;
    }

    const updatedCoupon = await coupon.save();
    res.json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    await coupon.deleteOne();
    res.json({ message: "Coupon removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};