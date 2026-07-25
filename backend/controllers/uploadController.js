const fs = require('fs');
const path = require('path');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const response = require('../helpers/response');

/**
 * Helper to delete local temp file
 */
const cleanupLocalFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error('Failed to delete temporary local file:', err.message);
    }
  }
};

/**
 * POST /api/upload/image
 * Admin image upload (Course thumbnail or Module thumbnail)
 */
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return response.error(res, 'No image file provided', 400);
    }

    const filePath = req.file.path;

    if (isCloudinaryConfigured && cloudinary) {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'dhanvijeta/thumbnails',
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }]
      });

      cleanupLocalFile(filePath);

      return response.success(
        res,
        {
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format
        },
        'Image uploaded to Cloudinary successfully'
      );
    }

    // Local file fallback when Cloudinary is not configured
    const localUrl = `/uploads/${req.file.filename}`;
    return response.success(
      res,
      {
        url: localUrl,
        public_id: `local_${req.file.filename}`,
        format: path.extname(req.file.originalname).replace('.', '')
      },
      'Image uploaded locally'
    );
  } catch (error) {
    if (req.file) cleanupLocalFile(req.file.path);
    next(error);
  }
};

/**
 * POST /api/upload/video
 * Admin video upload (MP4, MOV, AVI, MKV, WEBM)
 */
const uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return response.error(res, 'No video file provided', 400);
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).replace('.', '').toLowerCase();

    if (isCloudinaryConfigured && cloudinary) {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'dhanvijeta/videos',
        resource_type: 'video',
        chunk_size: 6000000 // 6MB chunks for large uploads
      });

      cleanupLocalFile(filePath);

      // Cloudinary video responses include auto-generated JPG thumbnail URL
      const videoThumbnailUrl = result.secure_url
        ? result.secure_url.replace(/\.[^/.]+$/, '.jpg')
        : '';

      return response.success(
        res,
        {
          videoUrl: result.secure_url,
          videoPublicId: result.public_id,
          videoDuration: Math.round(result.duration || 0),
          videoSize: result.bytes || req.file.size,
          videoFormat: result.format || fileExt,
          thumbnail: videoThumbnailUrl
        },
        'Video uploaded to Cloudinary successfully'
      );
    }

    // Local file fallback
    const localUrl = `/uploads/${req.file.filename}`;
    return response.success(
      res,
      {
        videoUrl: localUrl,
        videoPublicId: `local_${req.file.filename}`,
        videoDuration: 0,
        videoSize: req.file.size,
        videoFormat: fileExt,
        thumbnail: ''
      },
      'Video uploaded locally'
    );
  } catch (error) {
    if (req.file) cleanupLocalFile(req.file.path);
    next(error);
  }
};

/**
 * DELETE /api/upload
 * Delete Cloudinary resource by public_id
 */
const deleteMedia = async (req, res, next) => {
  try {
    const { public_id, resource_type = 'image' } = req.body;
    if (!public_id) {
      return response.error(res, 'public_id is required', 400);
    }

    if (isCloudinaryConfigured && cloudinary && !public_id.startsWith('local_')) {
      await cloudinary.uploader.destroy(public_id, { resource_type });
    }

    return response.success(res, null, 'Media deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
  uploadVideo,
  deleteMedia
};
