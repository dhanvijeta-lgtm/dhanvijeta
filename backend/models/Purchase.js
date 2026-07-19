const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      index: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    purchaseDate: {
      type: Date
    },
    expiryDate: {
      type: Date
    },
    progress: {
      completedLessons: [
        {
          type: String // We will store Lesson ID strings here
        }
      ]
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    hoursWatched: {
      type: Number,
      default: 0
    },
    certificateIssued: {
      type: Boolean,
      default: false
    },
    certificateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate'
    }
  },
  {
    timestamps: true
  }
);

// Compound index to prevent duplicate purchases for the same course by the same user
purchaseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
