const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// Admin-only upload routes
router.post(
  '/image',
  protect,
  authorize('admin'),
  upload.single('image'),
  uploadController.uploadImage
);

router.post(
  '/video',
  protect,
  authorize('admin'),
  upload.single('video'),
  uploadController.uploadVideo
);

router.delete(
  '/',
  protect,
  authorize('admin'),
  uploadController.deleteMedia
);

module.exports = router;
