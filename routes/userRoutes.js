import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (user must be logged in)
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
