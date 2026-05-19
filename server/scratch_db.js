const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
});
const User = mongoose.model("User", UserSchema);

async function checkUsers() {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGO_URI || "mongodb://cloth:iLUG8gmElAAjJZIG@ac-bm4gmxc-shard-00-00.qujfltp.mongodb.net:27017,ac-bm4gmxc-shard-00-01.qujfltp.mongodb.net:27017,ac-bm4gmxc-shard-00-02.qujfltp.mongodb.net:27017/cloth?ssl=true&replicaSet=atlas-ggo051-shard-0&authSource=admin&appName=Cluster0");
    console.log("Connected successfully!");

    const users = await User.find({}, "name email role");
    console.log("--- Registered Users List ---");
    console.log(JSON.stringify(users, null, 2));
    mongoose.connection.close();
  } catch (err) {
    console.error("Database query failed:", err);
  }
}

checkUsers();
