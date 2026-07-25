const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// Public routes
router.get('/', courseController.getCourses);
router.get('/:slug', courseController.getCourse);

// Admin-only course management routes
router.post('/', protect, authorize('admin'), courseController.createCourse);
router.put('/:id', protect, authorize('admin'), courseController.updateCourse);
router.delete('/:id', protect, authorize('admin'), courseController.deleteCourse);

// Section routes
router.post('/:id/sections', protect, authorize('admin'), courseController.addSection);

// Lesson routes (Add, Update, Delete)
router.post('/:id/sections/:sectionId/lessons', protect, authorize('admin'), courseController.addLesson);
router.put('/:id/sections/:sectionId/lessons/:lessonId', protect, authorize('admin'), courseController.updateLesson);
router.delete('/:id/sections/:sectionId/lessons/:lessonId', protect, authorize('admin'), courseController.deleteLesson);

module.exports = router;
