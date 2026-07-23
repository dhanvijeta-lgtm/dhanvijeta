const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdminIfNeeded = async () => {
  try {
    const email = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@dhanvijeta.com').toLowerCase().trim();
    const password = process.env.DEFAULT_ADMIN_PASSWORD || 'AdminPass123!';

    const adminExists = await User.findOne({ email });
    if (!adminExists) {
      await User.create({
        name: 'Dhan Vijeta Admin',
        email,
        password,
        role: 'admin',
        provider: 'email',
        isVerified: true
      });
      console.log(`[DB Auto-Seed] Default Admin created successfully: ${email}`);
    } else {
      // Ensure admin has role 'admin' and isVerified true
      if (adminExists.role !== 'admin' || !adminExists.isVerified) {
        adminExists.role = 'admin';
        adminExists.isVerified = true;
        await adminExists.save();
        console.log(`[DB Auto-Seed] Updated default admin role and verification status.`);
      }
    }
  } catch (err) {
    console.warn('[DB Auto-Seed] Non-blocking admin auto-seed notice:', err.message);
  }
};

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/dhanvijeta';
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Automatically ensure default admin user exists
    await seedAdminIfNeeded();
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
