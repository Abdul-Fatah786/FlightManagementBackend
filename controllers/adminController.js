import { UserModel } from '../models/userModel.js';
import { FlightModel } from '../models/flightModel.js';
import { BookingModel } from '../models/bookingModel.js';
import { PassengerModel } from '../models/passengerModel.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const { role, limit, offset } = req.query;
  const users = await UserModel.findAll({ role, limit, offset });

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

/**
 * @desc    Get all bookings
 * @route   GET /api/admin/bookings
 * @access  Private (Admin only)
 */
export const getAllBookings = asyncHandler(async (req, res, next) => {
  const { status, limit, offset } = req.query;
  const bookings = await BookingModel.findAll({ status, limit, offset });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings
    }
  });
});

/**
 * @desc    Get all passengers
 * @route   GET /api/admin/passengers
 * @access  Private (Admin only)
 */
export const getAllPassengers = asyncHandler(async (req, res, next) => {
  const { limit, offset } = req.query;
  const passengers = await PassengerModel.findAll({ limit, offset });

  res.status(200).json({
    status: 'success',
    results: passengers.length,
    data: {
      passengers
    }
  });
});

/**
 * @desc    Get bookings for a specific flight
 * @route   GET /api/admin/flights/:id/bookings
 * @access  Private (Admin only)
 */
export const getFlightBookings = asyncHandler(async (req, res, next) => {
  const flight = await FlightModel.findById(req.params.id);

  if (!flight) {
    return next(new AppError('Flight not found', 404));
  }

  const bookings = await BookingModel.findByFlightId(req.params.id);

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings
    }
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin only)
 */
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  await UserModel.delete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully'
  });
});
