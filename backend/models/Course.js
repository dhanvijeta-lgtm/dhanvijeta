const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String, // Direct video URL, YouTube link, Vimeo link, Google Drive link, etc.
    default: ''
  },
  videoPublicId: {
    type: String, // Cloudinary secure public ID or placeholder local relative path
    default: ''
  },
  videoDuration: {
    type: Number, // duration in seconds
    default: 0
  },
  pdfUrl: {
    type: String,
    default: ''
  },
  assignment: {
    type: String, // Assignment text or document URL
    default: ''
  },
  quiz: {
    questions: [
      {
        questionText: String,
        options: [String],
        correctOptionIndex: Number
      }
    ]
  }
});

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Course description is required']
    },
    instructor: {
      type: String,
      required: [true, 'Instructor name is required'],
      default: 'Dhan Vijeta Team'
    },
    duration: {
      type: String,
      default: '0 hours'
    },
    price: {
      type: Number,
      required: [true, 'Course price is required'],
      min: [0, 'Price must be greater than or equal to 0']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount must be at least 0'],
      max: [100, 'Discount cannot exceed 100%']
    },
    rating: {
      type: Number,
      default: 5.0
    },
    thumbnail: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Beginner',
        'Swing Trading',
        'Intraday',
        'Options Trading',
        'Futures',
        'Mutual Funds',
        'Technical Analysis',
        'Price Action',
        'Psychology',
        'Portfolio Building'
      ]
    },
    sections: [sectionSchema],
    faqs: [
      {
        question: String,
        answer: String
      }
    ],
    benefits: [String],
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Course', courseSchema);
