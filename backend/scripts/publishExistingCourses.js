require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Course = require('../models/Course');

const publishCourses = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/dhanvijeta';
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for publishing courses...');

    const result = await Course.updateMany(
      { $or: [{ isPublished: false }, { isPublished: { $exists: false } }] },
      { $set: { isPublished: true } }
    );

    console.log(`Successfully updated ${result.modifiedCount} courses to isPublished: true`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to publish existing courses:', err.message);
    process.exit(1);
  }
};

publishCourses();
