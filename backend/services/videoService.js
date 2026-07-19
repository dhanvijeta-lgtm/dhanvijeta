const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

const generateSecureStreamingUrl = (videoPublicId) => {
  if (!videoPublicId) {
    // Return a default premium placeholder video url
    return 'https://assets.mixkit.co/videos/preview/mixkit-stock-market-quotes-on-a-monitor-40098-large.mp4';
  }

  if (isCloudinaryConfigured) {
    try {
      // Generate a signed URL expiring in 2 hours (7200 seconds)
      const expiry = Math.floor(Date.now() / 1000) + 7200;
      const signedUrl = cloudinary.url(videoPublicId, {
        resource_type: 'video',
        sign_url: true,
        type: 'authenticated',
        expires_at: expiry
      });
      return signedUrl;
    } catch (error) {
      console.error('Error generating Cloudinary signed URL:', error.message);
      // Fallback
      return `https://assets.mixkit.co/videos/preview/mixkit-stock-market-quotes-on-a-monitor-40098-large.mp4`;
    }
  }

  // If local file storage is active, we return a mock secure stream route
  // For this development flow, we can point it to a free stock trading video
  return `https://assets.mixkit.co/videos/preview/mixkit-stock-market-quotes-on-a-monitor-40098-large.mp4`;
};

module.exports = {
  generateSecureStreamingUrl
};
