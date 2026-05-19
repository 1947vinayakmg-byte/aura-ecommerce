const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Order = require('./models/orderModel');

dotenv.config();

const checkDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    users.forEach(u => {
        console.log(`User: ${u.name}, Email: ${u.email}, Role: ${u.role}`);
    });

    const orders = await Order.find({}).populate('user', 'name email');
    console.log(`Found ${orders.length} orders`);
    if (orders.length > 0) {
      console.log('Sample Order Status:', orders[0].status);
      console.log('Sample Order User:', orders[0].user);
    }

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkDb();
