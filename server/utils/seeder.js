const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Product = require("../models/Product");
const connectDB = require("../config/db");

dotenv.config({ path: "./.env" });

const products = [
  {
    name: 'SILK DUSK BLAZER',
    description: 'A masterpiece of tailoring, the Silk Dusk Blazer features a relaxed yet structured silhouette with peak lapels and discrete pockets.',
    price: 1250,
    category: 'Men',
    brand: "AURA L'ÉLITE",
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&q=80&w=800'
    ],
    colors: ['#000000', '#2C3E50'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.9,
    numReviews: 24,
    isTrending: true,
    newProducts: true,
    countInStock: 10
  },
  {
    name: 'VELVET MIDNIGHT GOWN',
    description: 'Breathtaking floor-length gown in Italian midnight velvet with a plunging neckline and thigh-high slit.',
    price: 2800,
    category: 'Women',
    brand: "AURA L'ÉLITE",
    image: 'https://images.unsplash.com/photo-1539008835279-43469df069cc?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1539008835279-43469df069cc?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800'
    ],
    colors: ['#000033', '#000000'],
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 5.0,
    numReviews: 12,
    isTrending: true,
    countInStock: 5
  },
  {
    name: 'OBSIDIAN OVERSIZED HOODIE',
    description: 'Heavyweight premium cotton fleece with a dropped shoulder and structured hood. The quintessential streetwear piece.',
    price: 450,
    category: 'Streetwear',
    brand: "AURA L'ÉLITE",
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'
    ],
    colors: ['#000000', '#333333'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    rating: 4.8,
    numReviews: 56,
    isTrending: true,
    newProducts: true,
    countInStock: 25
  },
  {
    name: 'CASHMERE ESSENTIAL TEE',
    description: 'Ultra-soft cashmere blend t-shirt with a precision collar and seamless hem.',
    price: 320,
    category: 'Essentials',
    brand: "AURA L'ÉLITE",
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800'
    ],
    colors: ['#FFFFFF', '#E6E6E6', '#000000'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.7,
    numReviews: 89,
    newProducts: true,
    countInStock: 50
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Seed Admin
    const adminEmail = "admin@aura.com";
    const adminPassword = "admin123";

    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: "Luxury Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log("Admin User Created Successfully!");
    } else {
      console.log("Admin user already exists");
    }

    // Seed Products
    console.log("Clearing existing products...");
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Products seeded successfully!");

    console.log("Seeding completed.");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
