const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./server/models/orderModel');
const User = require('./server/models/User');

dotenv.config({ path: './server/.env' });

const checkOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const orders = await Order.find({}).populate('user', 'name email');
    console.log(`Found ${orders.length} orders`);
    
    if (orders.length > 0) {
      console.log('Sample Order:', JSON.stringify(orders[0], null, 2));
    } else {
      console.log('No orders found in database.');
    }

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkOrders();
