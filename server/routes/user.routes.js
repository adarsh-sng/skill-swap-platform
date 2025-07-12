import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getMe, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

export default router;