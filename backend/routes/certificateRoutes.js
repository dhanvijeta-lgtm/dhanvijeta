const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const response = require('../helpers/response');

// GET /api/certificates/verify/:code
router.get('/verify/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const certificate = await Certificate.findOne({ certificateCode: code })
      .populate('userId', 'name')
      .populate('courseId', 'title instructor duration');

    if (!certificate) {
      return response.error(res, 'Certificate code not found or invalid.', 404);
    }

    return response.success(res, {
      certificateCode: certificate.certificateCode,
      studentName: certificate.userId?.name,
      courseTitle: certificate.courseId?.title,
      instructor: certificate.courseId?.instructor,
      duration: certificate.courseId?.duration,
      completionDate: certificate.completionDate
    }, 'Certificate verified successfully');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
