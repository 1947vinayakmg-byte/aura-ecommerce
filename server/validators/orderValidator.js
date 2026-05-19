const validateOrder = (req, res, next) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (
    !orderItems ||
    orderItems.length === 0 ||
    !shippingAddress ||
    !paymentMethod
  ) {
    return res.status(400).json({
      message: "Invalid order data",
    });
  }

  next();
};

module.exports = {
  validateOrder,
};