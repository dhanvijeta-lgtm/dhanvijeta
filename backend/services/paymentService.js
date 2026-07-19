const Razorpay = require('razorpay');
const crypto = require('crypto');
const Coupon = require('../models/Coupon');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Purchase = require('../models/Purchase');

let razorpayInstance = null;
const useMockPayment = process.env.USE_MOCK_PAYMENT === 'true';

if (!useMockPayment && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  console.log('Razorpay Gateway initialized.');
} else {
  console.log('Payment Mode: Mock Payments Enabled.');
}

const createCheckoutOrder = async (userId, courseId, couponCode = null) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  // Calculate base price
  let finalPrice = course.price;
  if (course.discount > 0) {
    finalPrice = finalPrice - (finalPrice * (course.discount / 100));
  }

  // Check Coupon
  let appliedCoupon = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({ couponCode: couponCode.toUpperCase() });
    if (!coupon || !coupon.isValid()) {
      throw new Error('Invalid or expired coupon code');
    }
    
    if (coupon.discountType === 'Flat') {
      finalPrice = Math.max(0, finalPrice - coupon.discountValue);
    } else if (coupon.discountType === 'Percentage') {
      finalPrice = Math.max(0, finalPrice - (finalPrice * (coupon.discountValue / 100)));
    }
    appliedCoupon = coupon;
  }

  let orderId;
  let receiptId = `rcpt_${userId.toString().slice(-4)}_${courseId.toString().slice(-4)}_${Date.now().toString().slice(-4)}`;

  if (useMockPayment) {
    // Generate a mock order ID
    orderId = `mock_order_${crypto.randomBytes(8).toString('hex')}`;
  } else {
    if (!razorpayInstance) {
      throw new Error('Razorpay client not configured and mock payment is disabled.');
    }
    const options = {
      amount: Math.round(finalPrice * 100), // Razorpay accepts amounts in Paisa
      currency: 'INR',
      receipt: receiptId
    };
    const order = await razorpayInstance.orders.create(options);
    orderId = order.id;
  }

  // Record a payment entry in pending state
  const payment = await Payment.create({
    userId,
    courseId,
    orderId,
    amount: finalPrice,
    couponApplied: appliedCoupon ? appliedCoupon.couponCode : null,
    status: 'created'
  });

  return {
    orderId,
    amount: finalPrice,
    currency: 'INR',
    receipt: receiptId,
    isMock: useMockPayment
  };
};

const verifyCheckoutPayment = async (userId, verificationData) => {
  const { orderId, paymentId, signature } = verificationData;

  const payment = await Payment.findOne({ orderId, userId });
  if (!payment) {
    throw new Error('Transaction details not found');
  }

  let verified = false;

  if (useMockPayment) {
    verified = true;
  } else {
    if (!razorpayInstance) {
      throw new Error('Razorpay client not configured.');
    }
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    verified = expectedSignature === signature;
  }

  if (!verified) {
    payment.status = 'failed';
    await payment.save();
    throw new Error('Payment signature verification failed');
  }

  // Update payment logs
  payment.paymentId = paymentId || `mock_pay_${crypto.randomBytes(8).toString('hex')}`;
  payment.signature = signature || `mock_sig_${crypto.randomBytes(12).toString('hex')}`;
  payment.status = 'captured';
  await payment.save();

  // If coupon was applied, increment usage count
  if (payment.couponApplied) {
    const coupon = await Coupon.findOne({ couponCode: payment.couponApplied });
    if (coupon) {
      coupon.usesCount += 1;
      await coupon.save();
    }
  }

  // Upsert corresponding Course purchase access mapping
  const purchase = await Purchase.findOneAndUpdate(
    { userId, courseId: payment.courseId },
    {
      paymentId: payment._id,
      paymentStatus: 'completed',
      purchaseDate: new Date(),
      // Auto-unlock
      $setOnInsert: {
        progress: { completedLessons: [] },
        completionPercentage: 0,
        hoursWatched: 0,
        certificateIssued: false
      }
    },
    { upsert: true, new: true }
  );

  return { payment, purchase };
};

module.exports = {
  createCheckoutOrder,
  verifyCheckoutPayment
};
