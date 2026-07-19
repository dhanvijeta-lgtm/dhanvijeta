const cloudinary = require('cloudinary').v2;

const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('Cloudinary service initialized successfully.');
} else {
  console.warn('Cloudinary environment variables missing. Falling back to local file uploads.');
}

module.exports = {
  cloudinary: isCloudinaryConfigured ? cloudinary : null,
  isCloudinaryConfigured: !!isCloudinaryConfigured
};
