import { Router } from 'express';
import { getUserProfile, updateProfile, getMyHangouts } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `avatar-${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB for avatars
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  },
});

const router = Router();

router.get('/me/hangouts', protect, getMyHangouts);
router.get('/:id', getUserProfile);
router.put('/me', protect, upload.single('avatar'), updateProfile);

export default router;
