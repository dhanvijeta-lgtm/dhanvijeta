const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter (Images, Videos, PDFs)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [
    // Image formats
    '.png', '.jpg', '.jpeg', '.webp', '.svg',
    // Video formats
    '.mp4', '.mov', '.avi', '.mkv', '.webm',
    // Document formats
    '.pdf'
  ];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file extension: ${ext}. Allowed formats: PNG, JPG, JPEG, WEBP, MP4, MOV, AVI, MKV, WEBM, PDF`), false);
  }
};

const maxMb = Number(process.env.MAX_FILE_SIZE_MB) || 500;

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: maxMb * 1024 * 1024 // 500 MB limit
  }
});

module.exports = upload;
