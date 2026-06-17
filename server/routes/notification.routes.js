import { Router } from 'express';
import { getNotifications, respondToRequest, markAsRead } from '../controllers/notification.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protect); // All notification routes require auth

router.get('/', getNotifications);
router.put('/:id/respond', respondToRequest);
router.put('/:id/read', markAsRead);

export default router;
