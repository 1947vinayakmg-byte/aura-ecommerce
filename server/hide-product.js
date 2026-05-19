const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const products = await Product.find({});
  console.log("All products:");
  products.forEach(p => console.log(`- ${p.name}`));
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
