const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// Public blog reading routes
router.get('/', blogController.getBlogs);
router.get('/:slug', blogController.getBlogBySlug);

// Admin-managed blog editor routes
router.post('/', protect, authorize('admin'), blogController.createBlog);
router.put('/:id', protect, authorize('admin'), blogController.updateBlog);
router.delete('/:id', protect, authorize('admin'), blogController.deleteBlog);

module.exports = router;
