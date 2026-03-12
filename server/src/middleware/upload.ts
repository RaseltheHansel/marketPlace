import multer from 'multer';

// Just store in memory — we'll upload to cloudinary manually in the controller
const storage = multer.memoryStorage();

export const uploadImages = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only images allowed'));
  },
}).array('images', 5);

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single('avatar');