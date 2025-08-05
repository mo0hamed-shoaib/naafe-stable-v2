import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Allowed file types
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'application/pdf',
];

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    // Use timestamp + original name for uniqueness
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    cb(null, `${base}_${Date.now()}${ext}`);
  },
});

// File filter for type and extension
function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext) || !allowedMimeTypes.includes(file.mimetype)) {
    return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE',
      'الملف غير مدعوم. الرجاء رفع ملفات بصيغة JPG, PNG, أو PDF فقط.'));
  }
  cb(null, true);
}

// Max file size: 5MB
const MAX_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});

// Middleware for single file upload
const uploadSingle = (fieldName = 'file') => (req, res, next) => {
  upload.single(fieldName)(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      let message = err.message;
      if (err.code === 'LIMIT_FILE_SIZE') {
        message = 'حجم الملف كبير جدًا. الحد الأقصى 5 ميجابايت.';
      } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        message = err.message;
      }
      return res.status(400).json({ success: false, error: { message } });
    } else if (err) {
      // Other errors
      return res.status(400).json({ success: false, error: { message: 'فشل رفع الملف.' } });
    }
    next();
  });
};

// Middleware for multiple files upload
const uploadArray = (fieldName = 'files', maxCount = 10) => (req, res, next) => {
  upload.array(fieldName, maxCount)(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      let message = err.message;
      if (err.code === 'LIMIT_FILE_SIZE') {
        message = 'حجم أحد الملفات كبير جدًا. الحد الأقصى 5 ميجابايت.';
      } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        message = err.message;
      }
      return res.status(400).json({ success: false, error: { message } });
    } else if (err) {
      return res.status(400).json({ success: false, error: { message: 'فشل رفع الملفات.' } });
    }
    next();
  });
};

const uploadUpgradeAttachments = uploadArray('attachments', 3);

export default {
  uploadSingle,
  uploadArray,
  uploadUpgradeAttachments,
  raw: upload, // for advanced use
}; 