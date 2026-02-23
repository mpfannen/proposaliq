import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

// RFP uploads: PDF and Word only
const rfpFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents are allowed'));
  }
};

// Knowledge base uploads: PDF, Word, and Markdown
const kbFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.md'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, Word, and Markdown files are allowed'));
  }
};

export const upload = multer({
  storage,
  fileFilter: rfpFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});

export const kbUpload = multer({
  storage,
  fileFilter: kbFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});

export const uploadRFP = upload.single('rfp_file');
