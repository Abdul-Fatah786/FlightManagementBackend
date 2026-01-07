import express from 'express';
import {
  getAllFlights,
  searchFlights,
  getFlight,
  createFlight,
  updateFlight,
  deleteFlight
} from '../controllers/flightController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllFlights);
router.get('/search', searchFlights);
router.get('/:id', getFlight);

// Admin only routes
router.post('/', protect, authorize('admin'), createFlight);
router.put('/:id', protect, authorize('admin'), updateFlight);
router.delete('/:id', protect, authorize('admin'), deleteFlight);

export default router;
