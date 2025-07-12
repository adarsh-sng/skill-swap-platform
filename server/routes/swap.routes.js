import express from 'express';
import { protect } from '../middleware/auth.js';
import { createSwap, getReceivedSwaps, getSentSwaps } from '../controllers/swap.controller.js';

const router = express.Router();

router.post('/', protect, createSwap);
router.get('/sent', protect, getSentSwaps);
router.get('/received', protect, getReceivedSwaps);

export default router;
