const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    thumbnail: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      required: [true, 'Blog content is required']
    },
    author: {
      type: String,
      required: true,
      default: 'Dhan Vijeta'
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    publishedDate: {
      type: Date,
      default: Date.now
    },
    seoMeta: {
      title: String,
      description: String,
      keywords: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Blog', blogSchema);
