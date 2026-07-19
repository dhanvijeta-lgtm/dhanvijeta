const mongoose = require('mongoose');

const demoVideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    videoUrl: {
      type: String, // E.g., YouTube embed URL or static video URL
      required: true
    },
    description: {
      type: String
    },
    category: {
      type: String,
      default: 'General'
    },
    thumbnail: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('DemoVideo', demoVideoSchema);
