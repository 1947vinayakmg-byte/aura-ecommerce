const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./server/models/User');

dotenv.config({ path: './server/.env' });

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    
    users.forEach(u => {
        console.log(`User: ${u.name}, Email: ${u.email}, Role: ${u.role}`);
    });

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUsers();
