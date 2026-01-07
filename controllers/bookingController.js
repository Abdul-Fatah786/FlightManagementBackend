import { BookingModel } from '../models/bookingModel.js';
import { FlightModel } from '../models/flightModel.js';
import { PassengerModel } from '../models/passengerModel.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import crypto from 'crypto';

/**
 * Generate booking reference
 */
const generateBookingReference = () => {
  return 'BK' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

/**
 * @desc    Create new booking
 * @route   POST /api/bookings
 * @access  Private
 */
export const createBooking = asyncHandler(async (req, res, next) => {
  const { flight_id, passenger_id, seat_number, booking_class } = req.body;
  const user_id = req.user.id;

  // Check if flight exists
  const flight = await FlightModel.findById(flight_id);
  if (!flight) {
    return next(new AppError('Flight not found', 404));
  }

  // Check if flight has available seats
  if (flight.available_seats <= 0) {
    return next(new AppError('No available seats on this flight', 400));
  }

  // Check if passenger exists and belongs to user
  const passenger = await PassengerModel.findById(passenger_id);
  if (!passenger) {
    return next(new AppError('Passenger not found', 404));
  }

  if (passenger.user_id !== user_id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to book for this passenger', 403));
  }

  // Create booking
  const booking = await BookingModel.create({
    user_id,
    flight_id,
    passenger_id,
    seat_number,
    booking_class: booking_class || 'economy',
    status: 'confirmed'
  });

  // Update flight available seats
  await FlightModel.updateAvailableSeats(flight_id, -1);

  // Get full booking details
  const fullBooking = await BookingModel.findById(booking.id);

  res.status(201).json({
    status: 'success',
    data: {
      booking: fullBooking
    }
  });
});

/**
 * @desc    Get all bookings for logged in user
 * @route   GET /api/bookings
 * @access  Private
 */
export const getMyBookings = asyncHandler(async (req, res, next) => {
  const { status, limit, offset } = req.query;
  const user_id = req.user.id;

  const bookings = await BookingModel.findByUserId(user_id, {
    status,
    limit,
    offset
  });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings
    }
  });
});

/**
 * @desc    Get booking by ID
 * @route   GET /api/bookings/:id
 * @access  Private
 */
export const getBooking = asyncHandler(async (req, res, next) => {
  const booking = await BookingModel.findById(req.params.id);

  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  // Check if user owns the booking or is admin
  if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to view this booking', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

/**
 * @desc    Get booking by reference
 * @route   GET /api/bookings/reference/:reference
 * @access  Private
 */
export const getBookingByReference = asyncHandler(async (req, res, next) => {
  const booking = await BookingModel.findByReference(req.params.reference);

  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  // Check if user owns the booking or is admin
  if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to view this booking', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

/**
 * @desc    Cancel booking
 * @route   PATCH /api/bookings/:id/cancel
 * @access  Private
 */
export const cancelBooking = asyncHandler(async (req, res, next) => {
  const booking = await BookingModel.findById(req.params.id);

  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  // Check if user owns the booking or is admin
  if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to cancel this booking', 403));
  }

  if (booking.status === 'cancelled') {
    return next(new AppError('Booking is already cancelled', 400));
  }

  // Cancel booking
  const cancelledBooking = await BookingModel.cancel(req.params.id);

  // Update flight available seats
  await FlightModel.updateAvailableSeats(booking.flight_id, 1);

  res.status(200).json({
    status: 'success',
    data: {
      booking: cancelledBooking
    }
  });
});

/**
 * @desc    Delete booking
 * @route   DELETE /api/bookings/:id
 * @access  Private (Admin only)
 */
export const deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await BookingModel.findById(req.params.id);

  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  const deletedBooking = await BookingModel.delete(req.params.id);

  // Update flight available seats if booking was confirmed
  if (booking.status === 'confirmed') {
    await FlightModel.updateAvailableSeats(deletedBooking.flight_id, 1);
  }

  res.status(200).json({
    status: 'success',
    message: 'Booking deleted successfully'
  });
});
