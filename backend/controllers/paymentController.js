const paymentService = require('../services/paymentService');
const Payment = require('../models/Payment');
const response = require('../helpers/response');

// POST /api/payments/checkout
const checkout = async (req, res, next) => {
  try {
    const { courseId, couponCode } = req.body;
    if (!courseId) {
      return response.error(res, 'Course ID is required', 400);
    }

    const orderData = await paymentService.createCheckoutOrder(req.user.id, courseId, couponCode);
    return response.success(res, orderData, 'Checkout order created successfully');
  } catch (error) {
    next(error);
  }
};

// POST /api/payments/verify
const verify = async (req, res, next) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    if (!orderId) {
      return response.error(res, 'Order ID is required', 400);
    }

    const result = await paymentService.verifyCheckoutPayment(req.user.id, {
      orderId,
      paymentId,
      signature
    });

    return response.success(res, result, 'Payment verified and course unlocked successfully');
  } catch (error) {
    next(error);
  }
};

// POST /api/payments/cancel
const cancel = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return response.error(res, 'Order ID is required', 400);
    }

    const result = await paymentService.cancelCheckoutPayment(req.user.id, orderId);
    return response.success(res, result, 'Payment order marked as cancelled');
  } catch (error) {
    next(error);
  }
};

// POST /api/payments/webhook
const webhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = JSON.stringify(req.body);

    const result = await paymentService.processWebhookEvent(rawBody, signature, req.body);
    return res.status(200).json({ status: 'ok', ...result });
  } catch (error) {
    console.error('Razorpay Webhook Error:', error.message);
    return res.status(400).json({ status: 'error', message: error.message });
  }
};

// POST /api/payments/refund (Admin Only)
const refund = async (req, res, next) => {
  try {
    const { paymentId } = req.body;
    if (!paymentId) {
      return response.error(res, 'Payment ID is required', 400);
    }

    const result = await paymentService.refundPayment(paymentId);
    return response.success(res, result, 'Payment refunded and course access revoked');
  } catch (error) {
    next(error);
  }
};

// GET /api/payments/history
const getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .populate('courseId', 'title thumbnail')
      .sort('-createdAt');

    return response.success(res, payments, 'Payment history retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkout,
  verify,
  cancel,
  webhook,
  refund,
  getPaymentHistory
};
