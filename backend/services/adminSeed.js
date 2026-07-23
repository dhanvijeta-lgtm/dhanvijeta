require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/dhanvijeta';
  const email = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@dhanvijeta.com').toLowerCase().trim();
  const password = process.env.DEFAULT_ADMIN_PASSWORD || 'AdminPass123!';

  try {
    await mongoose.connect(uri);
    console.log('Database connected for admin seeding.');

    const adminExists = await User.findOne({ email });
    if (adminExists) {
      adminExists.role = 'admin';
      adminExists.isVerified = true;
      await adminExists.save();
      console.log(`Admin user with email ${email} already exists. Verified and updated role to 'admin'.`);
      process.exit(0);
    }

    await User.create({
      name: 'Dhan Vijeta Admin',
      email,
      password,
      role: 'admin',
      provider: 'email',
      isVerified: true
    });

    console.log(`Admin account successfully seeded: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding admin failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
