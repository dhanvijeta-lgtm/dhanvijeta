const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
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
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    paymentId: {
      type: String,
      index: true
    },
    signature: {
      type: String
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    couponApplied: {
      type: String
    },
    status: {
      type: String,
      enum: ['created', 'pending', 'captured', 'failed', 'cancelled', 'refunded'],
      default: 'created',
      index: true
    }
  },
  {
    timestamps: true
  }
);

paymentSchema.index({ userId: 1, courseId: 1, status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
