import express from 'express';
import {
  createPassenger,
  getMyPassengers,
  getPassenger,
  updatePassenger,
  deletePassenger
} from '../controllers/passengerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (user must be logged in)
router.use(protect);

router.post('/', createPassenger);
router.get('/', getMyPassengers);
router.get('/:id', getPassenger);
router.put('/:id', updatePassenger);
router.delete('/:id', deletePassenger);

export default router;
