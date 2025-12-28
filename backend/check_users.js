import mongoose from "mongoose";
import User from "./models/User.js";
import "dotenv/config";

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_CONNECTION_URL);
    console.log("Connected to DB");

    const users = await User.find({});
    console.log(`Found ${users.length} users.`);
    users.forEach(u => {
        console.log(`- ${u.email} (Role: ${u.role})`);
    });

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkUsers();