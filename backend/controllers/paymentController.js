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

    return response.success(res, result, 'Payment verified and batch unlocked successfully');
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
  getPaymentHistory
};
