const validateProduct = (req, res, next) => {
  const {
    name,
    description,
    price,
    image,
    category,
    brand,
  } = req.body;

  if (
    !name ||
    !description ||
    !price ||
    !image ||
    !category ||
    !brand
  ) {
    return res.status(400).json({
      message: "Please fill all product fields",
    });
  }

  next();
};

module.exports = {
  validateProduct,
};