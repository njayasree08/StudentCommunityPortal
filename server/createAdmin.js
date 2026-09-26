const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const ADMIN_NAME = "Portal Administrator";
const ADMIN_EMAIL = "admin@studentportal.com";
const ADMIN_PASSWORD = "Admin@12345";

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const existingAdmin = await User.findOne({
      email: ADMIN_EMAIL
    });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      ADMIN_PASSWORD,
      10
    );

    const admin = new User({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();

    console.log("");
    console.log("=================================");
    console.log("ADMIN ACCOUNT CREATED");
    console.log("=================================");
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log("Role: admin");
    console.log("=================================");
    console.log("");

    process.exit(0);

  } catch (error) {
    console.error("Admin creation failed:");
    console.error(error.message);

    process.exit(1);
  }
}

createAdmin();