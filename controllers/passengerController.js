import { PassengerModel } from '../models/passengerModel.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

/**
 * @desc    Create new passenger
 * @route   POST /api/passengers
 * @access  Private
 */
export const createPassenger = asyncHandler(async (req, res, next) => {
  const passengerData = {
    ...req.body,
    user_id: req.user.id
  };

  // Check if passenger with passport already exists
  const existingPassenger = await PassengerModel.findByPassport(passengerData.passport_number);
  if (existingPassenger) {
    return next(new AppError('Passenger with this passport number already exists', 400));
  }

  const passenger = await PassengerModel.create(passengerData);

  res.status(201).json({
    status: 'success',
    data: {
      passenger
    }
  });
});

/**
 * @desc    Get all passengers for logged in user
 * @route   GET /api/passengers
 * @access  Private
 */
export const getMyPassengers = asyncHandler(async (req, res, next) => {
  const passengers = await PassengerModel.findByUserId(req.user.id);

  res.status(200).json({
    status: 'success',
    results: passengers.length,
    data: {
      passengers
    }
  });
});

/**
 * @desc    Get passenger by ID
 * @route   GET /api/passengers/:id
 * @access  Private
 */
export const getPassenger = asyncHandler(async (req, res, next) => {
  const passenger = await PassengerModel.findById(req.params.id);

  if (!passenger) {
    return next(new AppError('Passenger not found', 404));
  }

  // Check if user owns the passenger or is admin
  if (passenger.user_id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to view this passenger', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      passenger
    }
  });
});

/**
 * @desc    Update passenger
 * @route   PUT /api/passengers/:id
 * @access  Private
 */
export const updatePassenger = asyncHandler(async (req, res, next) => {
  const passenger = await PassengerModel.findById(req.params.id);

  if (!passenger) {
    return next(new AppError('Passenger not found', 404));
  }

  // Check if user owns the passenger or is admin
  if (passenger.user_id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this passenger', 403));
  }

  const updatedPassenger = await PassengerModel.update(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: {
      passenger: updatedPassenger
    }
  });
});

/**
 * @desc    Delete passenger
 * @route   DELETE /api/passengers/:id
 * @access  Private
 */
export const deletePassenger = asyncHandler(async (req, res, next) => {
  const passenger = await PassengerModel.findById(req.params.id);

  if (!passenger) {
    return next(new AppError('Passenger not found', 404));
  }

  // Check if user owns the passenger or is admin
  if (passenger.user_id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this passenger', 403));
  }

  await PassengerModel.delete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Passenger deleted successfully'
  });
});
