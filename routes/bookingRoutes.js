import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBooking,
  getBookingByReference,
  cancelBooking,
  deleteBooking
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (user must be logged in)
router.use(protect);

router.post('/', createBooking);
router.get('/', getMyBookings);
router.get('/:id', getBooking);
router.get('/reference/:reference', getBookingByReference);
router.patch('/:id/cancel', cancelBooking);

// Admin only routes
router.delete('/:id', authorize('admin'), deleteBooking);

export default router;
