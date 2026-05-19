const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Coupon = require("./models/Coupon");

dotenv.config();

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/aura_elite")
  .then(async () => {
    console.log("Connected to MongoDB. Seeding coupons...");
    await Coupon.deleteMany({});
    
    const coupons = [
      {
        code: "AURA500",
        discount: 500,
        expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      },
      {
        code: "AURA1000",
        discount: 1000,
        expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        code: "LUXURY2000",
        discount: 2000,
        expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    ];

    await Coupon.insertMany(coupons);
    console.log("Coupons seeded successfully: AURA500, AURA1000, LUXURY2000");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error seeding coupons:", err);
    process.exit(1);
  });
