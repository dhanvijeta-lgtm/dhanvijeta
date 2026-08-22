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
  console.log('Razorpay Gateway initialized in LIVE/TEST API mode.');
} else {
  console.log('Payment Mode: Mock/Test Payments Enabled.');
}

/**
 * Creates a Razorpay Order strictly using the MongoDB Course price.
 * Rejects duplicate enrollments.
 */
const createCheckoutOrder = async (userId, courseId, couponCode = null) => {
  // 1. Duplicate purchase check
  const existingPurchase = await Purchase.findOne({
    userId,
    courseId,
    paymentStatus: 'completed'
  });

  if (existingPurchase) {
    const error = new Error('You are already enrolled in this course.');
    error.statusCode = 400;
    throw error;
  }

  // 2. Fetch official Course record from DB (NEVER trust frontend price)
  const course = await Course.findById(courseId);
  if (!course) {
    const error = new Error('Course not found');
    error.statusCode = 404;
    throw error;
  }

  // 3. Calculate base price from DB
  let finalPrice = course.price;
  if (course.discount > 0) {
    finalPrice = finalPrice - (finalPrice * (course.discount / 100));
  }

  // 4. Server-side coupon verification
  let appliedCoupon = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({ couponCode: couponCode.toUpperCase() });
    if (!coupon || !coupon.isValid()) {
      const error = new Error('Invalid or expired coupon code');
      error.statusCode = 400;
      throw error;
    }

    if (coupon.discountType === 'Flat') {
      finalPrice = Math.max(0, finalPrice - coupon.discountValue);
    } else if (coupon.discountType === 'Percentage') {
      finalPrice = Math.max(0, finalPrice - (finalPrice * (coupon.discountValue / 100)));
    }
    appliedCoupon = coupon;
  }

  const receiptId = `rcpt_${userId.toString().slice(-4)}_${courseId.toString().slice(-4)}_${Date.now().toString().slice(-4)}`;

  // 5. Free course auto-enrollment
  if (finalPrice <= 0) {
    const freeOrderId = `free_order_${crypto.randomBytes(8).toString('hex')}`;
    
    const payment = await Payment.create({
      userId,
      courseId,
      orderId: freeOrderId,
      paymentId: `free_enroll_${crypto.randomBytes(6).toString('hex')}`,
      amount: 0,
      couponApplied: appliedCoupon ? appliedCoupon.couponCode : null,
      status: 'captured'
    });

    const purchase = await Purchase.findOneAndUpdate(
      { userId, courseId },
      {
        paymentId: payment._id,
        paymentStatus: 'completed',
        purchaseDate: new Date(),
        $setOnInsert: {
          progress: { completedLessons: [] },
          completionPercentage: 0,
          hoursWatched: 0,
          certificateIssued: false
        }
      },
      { upsert: true, new: true }
    );

    return {
      orderId: freeOrderId,
      amount: 0,
      isFree: true,
      purchase
    };
  }

  // 6. Paid course Razorpay order creation
  let orderId;
  if (useMockPayment) {
    orderId = `mock_order_${crypto.randomBytes(8).toString('hex')}`;
  } else {
    if (!razorpayInstance) {
      throw new Error('Razorpay client not configured and mock payment is disabled.');
    }
    const options = {
      amount: Math.round(finalPrice * 100), // Amount in Paisa
      currency: 'INR',
      receipt: receiptId,
      notes: {
        userId: userId.toString(),
        courseId: courseId.toString()
      }
    };
    const order = await razorpayInstance.orders.create(options);
    orderId = order.id;
  }

  // Record pending payment entry in database
  await Payment.create({
    userId,
    courseId,
    orderId,
    amount: finalPrice,
    currency: 'INR',
    couponApplied: appliedCoupon ? appliedCoupon.couponCode : null,
    status: 'created'
  });

  return {
    orderId,
    amount: finalPrice,
    currency: 'INR',
    receipt: receiptId,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_THDf7tFOmnPEur',
    isMock: useMockPayment
  };
};

/**
 * Server-side payment verification & signature validation
 */
const verifyCheckoutPayment = async (userId, verificationData) => {
  const { orderId, paymentId, signature } = verificationData;

  const payment = await Payment.findOne({ orderId, userId });
  if (!payment) {
    const error = new Error('Transaction record not found');
    error.statusCode = 404;
    throw error;
  }

  // Idempotent retry check
  if (payment.status === 'captured') {
    const existingPurchase = await Purchase.findOne({ userId, courseId: payment.courseId });
    return { payment, purchase: existingPurchase };
  }

  let verified = false;

  if (useMockPayment) {
    verified = true;
  } else {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay Key Secret is missing in environment.');
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
    const error = new Error('Payment signature verification failed. Access denied.');
    error.statusCode = 400;
    throw error;
  }

  // Update payment status to captured
  payment.paymentId = paymentId || `mock_pay_${crypto.randomBytes(8).toString('hex')}`;
  payment.signature = signature || `mock_sig_${crypto.randomBytes(12).toString('hex')}`;
  payment.status = 'captured';
  await payment.save();

  // Increment coupon usage count if applicable
  if (payment.couponApplied) {
    const coupon = await Coupon.findOne({ couponCode: payment.couponApplied });
    if (coupon) {
      coupon.usesCount += 1;
      await coupon.save();
    }
  }

  // Grant active course enrollment
  const purchase = await Purchase.findOneAndUpdate(
    { userId, courseId: payment.courseId },
    {
      paymentId: payment._id,
      paymentStatus: 'completed',
      purchaseDate: new Date(),
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

/**
 * Handles user closing Razorpay checkout window
 */
const cancelCheckoutPayment = async (userId, orderId) => {
  const payment = await Payment.findOne({ orderId, userId, status: 'created' });
  if (payment) {
    payment.status = 'cancelled';
    await payment.save();
  }
  return { success: true, message: 'Payment marked as cancelled' };
};

/**
 * Razorpay Webhook Signature Verification & Idempotent Reconciliation
 */
const processWebhookEvent = async (rawBody, signature, event) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
  if (secret && signature) {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      const error = new Error('Webhook signature verification failed');
      error.statusCode = 400;
      throw error;
    }
  }

  // Process payment.captured or order.paid
  if (event.event === 'payment.captured' || event.event === 'order.paid') {
    const entity = event.payload?.payment?.entity || event.payload?.order?.entity;
    if (!entity) return { processed: false };

    const orderId = entity.order_id || entity.id;
    const paymentId = entity.id;

    const payment = await Payment.findOne({ orderId });
    if (payment && payment.status !== 'captured') {
      payment.paymentId = paymentId;
      payment.status = 'captured';
      await payment.save();

      await Purchase.findOneAndUpdate(
        { userId: payment.userId, courseId: payment.courseId },
        {
          paymentId: payment._id,
          paymentStatus: 'completed',
          purchaseDate: new Date(),
          $setOnInsert: {
            progress: { completedLessons: [] },
            completionPercentage: 0,
            hoursWatched: 0,
            certificateIssued: false
          }
        },
        { upsert: true, new: true }
      );

      return { processed: true, reconciled: true };
    }
  }

  return { processed: true, reconciled: false };
};

/**
 * Refund Payment & Revoke Access (Admin Flow)
 */
const refundPayment = async (paymentId) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    const error = new Error('Payment not found');
    error.statusCode = 404;
    throw error;
  }

  payment.status = 'refunded';
  await payment.save();

  await Purchase.findOneAndUpdate(
    { userId: payment.userId, courseId: payment.courseId },
    { paymentStatus: 'revoked' }
  );

  return { success: true, message: 'Payment refunded and course access revoked successfully' };
};

module.exports = {
  createCheckoutOrder,
  verifyCheckoutPayment,
  cancelCheckoutPayment,
  processWebhookEvent,
  refundPayment
};
