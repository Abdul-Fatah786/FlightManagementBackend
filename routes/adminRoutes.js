import express from 'express';
import {
  getAllUsers,
  getAllBookings,
  getAllPassengers,
  getFlightBookings,
  deleteUser
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are admin only  
router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.get('/bookings', getAllBookings);
router.get('/passengers', getAllPassengers);
router.get('/flights/:id/bookings', getFlightBookings);
router.delete('/users/:id', deleteUser);

export default router;
