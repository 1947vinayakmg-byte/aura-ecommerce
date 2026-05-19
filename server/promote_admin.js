const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
});
const User = mongoose.model("User", UserSchema);

async function promote(email) {
  if (!email) {
    console.error("Please provide an email address!");
    process.exit(1);
  }
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGO_URI || "mongodb://cloth:iLUG8gmElAAjJZIG@ac-bm4gmxc-shard-00-00.qujfltp.mongodb.net:27017,ac-bm4gmxc-shard-00-01.qujfltp.mongodb.net:27017,ac-bm4gmxc-shard-00-02.qujfltp.mongodb.net:27017/cloth?ssl=true&replicaSet=atlas-ggo051-shard-0&authSource=admin&appName=Cluster0");
    console.log("Connected successfully!");

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`No user found with email: ${email}`);
    } else {
      user.role = "admin";
      await user.save();
      console.log(`SUCCESS: User ${email} has been successfully promoted to "admin"!`);
    }
    mongoose.connection.close();
  } catch (err) {
    console.error("Failed to promote user:", err);
  }
}

// Promotes the specific user
promote("neetvinayakmg@gmail.com");
