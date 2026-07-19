const User = require('../models/User');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Purchase = require('../models/Purchase');
const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');
const DemoVideo = require('../models/DemoVideo');
const response = require('../helpers/response');

// GET /api/admin/analytics
const getDashboardAnalytics = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });

    // Calculate Revenues
    const totalRevenueResult = await Payment.aggregate([
      { $match: { status: 'captured' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayRevenueResult = await Payment.aggregate([
      { $match: { status: 'captured', createdAt: { $gte: startOfToday } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const todayRevenue = todayRevenueResult[0]?.total || 0;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const monthlyRevenueResult = await Payment.aggregate([
      { $match: { status: 'captured', createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const monthlyRevenue = monthlyRevenueResult[0]?.total || 0;

    // Recent Registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newRegistrations = await User.countDocuments({
      role: 'student',
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Recent Payments
    const recentPayments = await Payment.find()
      .populate('userId', 'name email')
      .populate('courseId', 'title')
      .sort('-createdAt')
      .limit(10);

    // Top Selling Courses Aggregation
    const topCourses = await Purchase.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: '$courseId', salesCount: { $sum: 1 } } },
      { $sort: { salesCount: -1 } },
      { $limit: 5 }
    ]);
    // Populate manual to handle ref
    const topSellingCourses = await Promise.all(
      topCourses.map(async (item) => {
        const course = await Course.findById(item._id).select('title price category thumbnail');
        return {
          course,
          salesCount: item.salesCount,
          totalRevenue: item.salesCount * (course?.price || 0)
        };
      })
    );

    // Course Analytics Summary
    const allCourses = await Course.find();
    const courseStats = await Promise.all(
      allCourses.map(async (c) => {
        const enrollments = await Purchase.countDocuments({ courseId: c._id, paymentStatus: 'completed' });
        return {
          id: c._id,
          title: c.title,
          category: c.category,
          price: c.price,
          isPublished: c.isPublished,
          enrollments
        };
      })
    );

    // Daily Revenue Chart Data (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dailyRevenue = await Payment.aggregate([
      { $match: { status: 'captured', createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          amount: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Student Growth Chart Data (last 7 days)
    const dailyRegistrations = await User.aggregate([
      { $match: { role: 'student', createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return response.success(res, {
      metrics: {
        todayRevenue,
        monthlyRevenue,
        totalRevenue,
        totalStudents,
        newRegistrations
      },
      recentPayments,
      topSellingCourses,
      courseStats,
      charts: {
        dailyRevenue,
        dailyRegistrations
      }
    }, 'Dashboard analytics generated successfully');
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/students
const getStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('name email isVerified streakCount createdAt lastActiveDate')
      .sort('-createdAt');

    // Attach purchase counts
    const enrichedStudents = await Promise.all(
      students.map(async (student) => {
        const purchases = await Purchase.find({ userId: student._id, paymentStatus: 'completed' })
          .populate('courseId', 'title');
        return {
          ...student.toObject(),
          purchasedCourses: purchases.map(p => p.courseId?.title).filter(Boolean)
        };
      })
    );

    return response.success(res, enrichedStudents, 'Students fetched successfully');
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/announcements
const createAnnouncement = async (req, res, next) => {
  try {
    const { courseId, title, content } = req.body;
    if (!courseId || !title || !content) {
      return response.error(res, 'Course ID, Title, and Content are required', 400);
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return response.error(res, 'Course not found', 404);
    }

    // Write announcement
    const announcement = await Announcement.create({ courseId, title, content });

    // Send notifications to all students who bought this course
    const enrollments = await Purchase.find({ courseId, paymentStatus: 'completed' });
    const notifications = enrollments.map((purchase) => ({
      userId: purchase.userId,
      title: `Announcement: ${course.title}`,
      content: `A new update has been posted: "${title}". Check your Batch.`,
      type: 'CourseUpdated'
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    return response.success(res, announcement, 'Announcement posted and notifications triggered successfully', 201);
  } catch (error) {
    next(error);
  }
};

// DEMO VIDEOS CRUD APIs
const getDemoVideos = async (req, res, next) => {
  try {
    const videos = await DemoVideo.find().sort('-createdAt');
    return response.success(res, videos, 'Demo videos fetched successfully');
  } catch (error) {
    next(error);
  }
};

const createDemoVideo = async (req, res, next) => {
  try {
    const video = await DemoVideo.create(req.body);
    return response.success(res, video, 'Demo video created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateDemoVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const video = await DemoVideo.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!video) {
      return response.error(res, 'Demo video not found', 404);
    }
    return response.success(res, video, 'Demo video updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteDemoVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const video = await DemoVideo.findByIdAndDelete(id);
    if (!video) {
      return response.error(res, 'Demo video not found', 404);
    }
    return response.success(res, null, 'Demo video deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardAnalytics,
  getStudents,
  createAnnouncement,
  getDemoVideos,
  createDemoVideo,
  updateDemoVideo,
  deleteDemoVideo
};
