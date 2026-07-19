const Coupon = require('../models/Coupon');
const Course = require('../models/Course');
const response = require('../helpers/response');

// GET /api/coupons/validate?code=XXXX&courseId=XXXX
const validateCoupon = async (req, res, next) => {
  try {
    const { code, courseId } = req.query;
    if (!code || !courseId) {
      return response.error(res, 'Coupon code and Course ID are required', 400);
    }

    const coupon = await Coupon.findOne({ couponCode: code.toUpperCase() });
    if (!coupon) {
      return response.error(res, 'Invalid coupon code', 404);
    }

    if (!coupon.isValid()) {
      return response.error(res, 'Coupon code has expired or reached usage limits', 400);
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return response.error(res, 'Course not found', 404);
    }

    // Calculate base discounted price
    let basePrice = course.price;
    if (course.discount > 0) {
      basePrice = basePrice - (basePrice * (course.discount / 100));
    }

    // Apply coupon
    let discountAmount = 0;
    if (coupon.discountType === 'Flat') {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === 'Percentage') {
      discountAmount = basePrice * (coupon.discountValue / 100);
    }

    const finalPrice = Math.max(0, basePrice - discountAmount);

    return response.success(res, {
      couponCode: coupon.couponCode,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      originalPrice: course.price,
      discountedBasePrice: basePrice,
      discountAmount,
      finalPrice
    }, 'Coupon validated successfully');
  } catch (error) {
    next(error);
  }
};

// GET /api/coupons (Admin Only)
const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort('-createdAt');
    return response.success(res, coupons, 'Coupons fetched successfully');
  } catch (error) {
    next(error);
  }
};

// POST /api/coupons (Admin Only)
const createCoupon = async (req, res, next) => {
  try {
    const { couponCode, discountType, discountValue, expiryDate, maximumUses, activeStatus } = req.body;
    
    const exists = await Coupon.findOne({ couponCode: couponCode.toUpperCase() });
    if (exists) {
      return response.error(res, 'Coupon code already exists', 400);
    }

    const coupon = await Coupon.create({
      couponCode: couponCode.toUpperCase(),
      discountType,
      discountValue,
      expiryDate,
      maximumUses,
      activeStatus
    });

    return response.success(res, coupon, 'Coupon created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// PUT /api/coupons/:id (Admin Only)
const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!coupon) {
      return response.error(res, 'Coupon not found', 404);
    }
    return response.success(res, coupon, 'Coupon updated successfully');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/coupons/:id (Admin Only)
const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return response.error(res, 'Coupon not found', 404);
    }
    return response.success(res, null, 'Coupon deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
};
