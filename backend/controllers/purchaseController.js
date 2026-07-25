const Purchase = require('../models/Purchase');
const Course = require('../models/Course');
const Announcement = require('../models/Announcement');
const videoService = require('../services/videoService');
const certificateService = require('../services/certificateService');
const response = require('../helpers/response');

// GET /api/my-batch
const getMyPurchases = async (req, res, next) => {
  try {
    const purchases = await Purchase.find({ userId: req.user.id, paymentStatus: 'completed' })
      .populate('courseId', 'title slug thumbnail duration description category')
      .sort('-purchaseDate');

    return response.success(res, purchases, 'Purchased batches fetched successfully');
  } catch (error) {
    next(error);
  }
};

// GET /api/my-batch/:courseId
const getBatchDetails = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    let purchase = await Purchase.findOne({
      userId: req.user.id,
      courseId,
      paymentStatus: 'completed'
    }).populate('certificateId');

    const course = await Course.findById(courseId);
    if (!course) {
      return response.error(res, 'Course not found', 404);
    }

    if (!purchase) {
      // If course is free (price === 0 or 100% discount), auto-enroll user
      const isFreeCourse = course.price === 0 || course.discount === 100;
      if (isFreeCourse) {
        const Payment = require('../models/Payment');
        const crypto = require('crypto');
        const freeOrderId = `free_order_${crypto.randomBytes(8).toString('hex')}`;
        
        const freePayment = await Payment.create({
          userId: req.user.id,
          courseId,
          orderId: freeOrderId,
          paymentId: `free_enroll_${crypto.randomBytes(6).toString('hex')}`,
          amount: 0,
          status: 'captured'
        });

        purchase = await Purchase.create({
          userId: req.user.id,
          courseId,
          paymentId: freePayment._id,
          paymentStatus: 'completed',
          purchaseDate: new Date(),
          progress: { completedLessons: [] },
          completionPercentage: 0,
          hoursWatched: 0,
          certificateIssued: false
        });
      } else {
        return response.error(
          res,
          'You have not purchased this course yet or your payment is pending.',
          403
        );
      }
    }

    // Generate secure expiring signed URLs for all videos in sections
    const enrichedSections = course.sections.map(section => {
      const sanitizedLessons = section.lessons.map(lesson => {
        const videoStreamUrl = lesson.videoUrl || (lesson.videoPublicId 
          ? videoService.generateSecureStreamingUrl(lesson.videoPublicId)
          : '');
        return {
          _id: lesson._id,
          title: lesson.title,
          description: lesson.description,
          videoUrl: lesson.videoUrl || '',
          videoDuration: lesson.videoDuration,
          videoStreamUrl, // Video URL or expiring signed Cloudinary URL
          thumbnail: lesson.thumbnail || '',
          pdfUrl: lesson.pdfUrl,
          assignment: lesson.assignment,
          quiz: lesson.quiz
        };
      });

      return {
        _id: section._id,
        title: section.title,
        lessons: sanitizedLessons
      };
    });

    // Fetch announcements
    const announcements = await Announcement.find({ courseId }).sort('-createdAt');

    return response.success(res, {
      purchase,
      course: {
        _id: course._id,
        title: course.title,
        instructor: course.instructor,
        sections: enrichedSections
      },
      announcements
    }, 'Enrolled course content fetched successfully');
  } catch (error) {
    next(error);
  }
};

// POST /api/my-batch/:courseId/lessons/:lessonId/complete
const completeLesson = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;

    const purchase = await Purchase.findOne({
      userId: req.user.id,
      courseId,
      paymentStatus: 'completed'
    });

    if (!purchase) {
      return response.error(res, 'Batch access denied', 403);
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return response.error(res, 'Course not found', 404);
    }

    // Add lesson to completed array if it doesn't exist
    if (!purchase.progress.completedLessons.includes(lessonId)) {
      purchase.progress.completedLessons.push(lessonId);
    }

    // Calculate total lessons in course
    let totalLessonsCount = 0;
    course.sections.forEach(sec => {
      totalLessonsCount += sec.lessons.length;
    });

    if (totalLessonsCount > 0) {
      const completedCount = purchase.progress.completedLessons.length;
      purchase.completionPercentage = Math.min(
        100,
        Math.round((completedCount / totalLessonsCount) * 100)
      );
    } else {
      purchase.completionPercentage = 100;
    }

    let certificate = null;
    if (purchase.completionPercentage === 100) {
      try {
        certificate = await certificateService.checkAndGenerateCertificate(req.user.id, courseId);
      } catch (certError) {
        console.error('Auto certificate generation failed:', certError.message);
      }
    }

    await purchase.save();

    return response.success(res, {
      completionPercentage: purchase.completionPercentage,
      completedLessons: purchase.progress.completedLessons,
      certificateIssued: purchase.certificateIssued,
      certificate
    }, 'Lesson marked as completed');
  } catch (error) {
    next(error);
  }
};

// GET /api/my-batch/:courseId/certificate
const getBatchCertificate = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const certificate = await certificateService.checkAndGenerateCertificate(req.user.id, courseId);
    return response.success(res, certificate, 'Certificate fetched successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyPurchases,
  getBatchDetails,
  completeLesson,
  getBatchCertificate
};
