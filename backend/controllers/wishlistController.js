const Wishlist = require('../models/Wishlist');
const response = require('../helpers/response');

const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id })
      .populate('courses', 'title slug price discount thumbnail rating category duration');

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id, courses: [] });
    }

    return response.success(res, wishlist.courses, 'Wishlist retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const addToWishlist = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return response.error(res, 'Course ID is required', 400);
    }

    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id, courses: [courseId] });
    } else {
      if (wishlist.courses.includes(courseId)) {
        return response.success(res, wishlist.courses, 'Course already in wishlist');
      }
      wishlist.courses.push(courseId);
      await wishlist.save();
    }

    return response.success(res, wishlist.courses, 'Course added to wishlist');
  } catch (error) {
    next(error);
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    if (!courseId) {
      return response.error(res, 'Course ID is required', 400);
    }

    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (wishlist) {
      wishlist.courses = wishlist.courses.filter(id => id.toString() !== courseId);
      await wishlist.save();
    }

    return response.success(res, wishlist ? wishlist.courses : [], 'Course removed from wishlist');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
