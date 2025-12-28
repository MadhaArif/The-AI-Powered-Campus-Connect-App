import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import "dotenv/config";

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_CONNECTION_URL);
    console.log("Connected to DB");

    const email = "ali@gmail.com";
    const newPassword = "123"; // Simple password for testing

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
        console.log("User not found!");
        process.exit(1);
    }

    // Manually hash because we might bypass save hook or just to be sure
    // Actually, let's use the save hook logic by just setting it and saving
    // But wait, the save hook only runs if modified.
    
    user.password = newPassword; 
    await user.save(); 
    // The pre-save hook in User.js handles hashing:
    // if (!this.isModified("password")) return next();
    // this.password = await bcrypt.hash(this.password, 10);

    console.log(`Password for ${email} reset to '${newPassword}'`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

resetPassword();