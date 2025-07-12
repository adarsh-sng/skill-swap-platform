import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createSwap } from '../controllers/swap.controller.js';

const router = express.Router();

router.post('/', protect, createSwap);

export default router;
