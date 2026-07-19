const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    couponCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    discountType: {
      type: String,
      enum: ['Flat', 'Percentage'],
      required: true
    },
    discountValue: {
      type: Number,
      required: true,
      min: [0, 'Discount value cannot be negative']
    },
    expiryDate: {
      type: Date,
      required: true
    },
    maximumUses: {
      type: Number,
      default: 100
    },
    usesCount: {
      type: Number,
      default: 0
    },
    activeStatus: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Method to validate if the coupon can be applied
couponSchema.methods.isValid = function () {
  const now = new Date();
  return (
    this.activeStatus &&
    this.expiryDate > now &&
    this.usesCount < this.maximumUses
  );
};

module.exports = mongoose.model('Coupon', couponSchema);
