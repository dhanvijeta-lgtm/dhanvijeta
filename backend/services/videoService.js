const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

/**
 * Extracts a Google Drive File ID from a raw ID or full Google Drive URL.
 * Examples supported:
 * - 1ABCxyz123-456_789
 * - https://drive.google.com/file/d/1ABCxyz123-456_789/view
 * - https://drive.google.com/file/d/1ABCxyz123-456_789/preview
 * - https://drive.google.com/open?id=1ABCxyz123-456_789
 * - https://drive.google.com/uc?id=1ABCxyz123-456_789
 */
const extractGoogleDriveFileId = (input) => {
  if (!input) return '';
  const str = String(input).trim();

  // Regex pattern matching Google Drive File IDs (25 to 100 characters alphanumeric with - and _)
  const match = str.match(/(?:file\/d\/|id=|\/d\/)([a-zA-Z0-9_-]{25,100})/);
  if (match && match[1]) {
    return match[1];
  }

  // If input matches raw File ID syntax directly
  if (/^[a-zA-Z0-9_-]{25,100}$/.test(str)) {
    return str;
  }

  return '';
};

/**
 * Returns Google Drive preview embed URL
 */
const getGoogleDriveEmbedUrl = (fileId) => {
  const cleanId = extractGoogleDriveFileId(fileId);
  if (!cleanId) return '';
  return `https://drive.google.com/file/d/${cleanId}/preview`;
};

/**
 * Standardized video provider abstraction layer
 */
const getVideoEmbedInfo = (lesson) => {
  if (!lesson) return null;

  const provider = lesson.videoProvider || (lesson.googleDriveFileId ? 'google-drive' : 'external');
  const googleDriveFileId = extractGoogleDriveFileId(lesson.googleDriveFileId || lesson.videoUrl);

  if (provider === 'google-drive' || googleDriveFileId) {
    return {
      provider: 'google-drive',
      fileId: googleDriveFileId,
      embedUrl: getGoogleDriveEmbedUrl(googleDriveFileId),
      videoUrl: lesson.videoUrl || '',
      duration: lesson.videoDuration || 0,
      isPreview: !!lesson.isPreview
    };
  }

  // Legacy or External / Cloudinary fallback
  const streamingUrl = lesson.videoUrl || (lesson.videoPublicId 
    ? generateSecureStreamingUrl(lesson.videoPublicId)
    : '');

  return {
    provider: provider || 'external',
    fileId: '',
    embedUrl: streamingUrl,
    videoUrl: streamingUrl,
    duration: lesson.videoDuration || 0,
    isPreview: !!lesson.isPreview
  };
};

const generateSecureStreamingUrl = (videoPublicId) => {
  if (!videoPublicId) {
    return 'https://assets.mixkit.co/videos/preview/mixkit-stock-market-quotes-on-a-monitor-40098-large.mp4';
  }

  if (isCloudinaryConfigured) {
    try {
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
      return `https://assets.mixkit.co/videos/preview/mixkit-stock-market-quotes-on-a-monitor-40098-large.mp4`;
    }
  }

  return `https://assets.mixkit.co/videos/preview/mixkit-stock-market-quotes-on-a-monitor-40098-large.mp4`;
};

module.exports = {
  extractGoogleDriveFileId,
  getGoogleDriveEmbedUrl,
  getVideoEmbedInfo,
  generateSecureStreamingUrl
};
