import { FlightModel } from '../models/flightModel.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

/**
 * @desc    Get all flights
 * @route   GET /api/flights
 * @access  Public
 */
export const getAllFlights = asyncHandler(async (req, res, next) => {
  const { status, limit, offset } = req.query;
  
  const flights = await FlightModel.findAll({ status, limit, offset });

  res.status(200).json({
    status: 'success',
    results: flights.length,
    data: {
      flights
    }
  });
});

/**
 * @desc    Search flights
 * @route   GET /api/flights/search
 * @access  Public
 */
export const searchFlights = asyncHandler(async (req, res, next) => {
  let { origin, destination, departure_date, airline, status } = req.query;

  // Trim whitespace from all string parameters
  origin = origin?.trim();
  destination = destination?.trim();
  departure_date = departure_date?.trim();
  airline = airline?.trim();

  // Validate required fields
  if (!origin || !destination) {
    return next(new AppError('Origin and destination are required', 400));
  }

  // Convert empty strings to undefined for optional fields
  departure_date = departure_date || undefined;
  airline = airline || undefined;

  const flights = await FlightModel.search({
    origin,
    destination,
    departure_date,
    airline,
    status
  });

  res.status(200).json({
    status: 'success',
    results: flights.length,
    data: {
      flights
    }
  });
});

/**
 * @desc    Get flight by ID
 * @route   GET /api/flights/:id
 * @access  Public
 */
export const getFlight = asyncHandler(async (req, res, next) => {
  const flight = await FlightModel.findById(req.params.id);

  if (!flight) {
    return next(new AppError('Flight not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      flight
    }
  });
});

/**
 * @desc    Create new flight
 * @route   POST /api/flights
 * @access  Private (Admin only)
 */
export const createFlight = asyncHandler(async (req, res, next) => {
  const flightData = req.body;

  // Check if flight number already exists
  const existingFlight = await FlightModel.findByFlightNumber(flightData.flight_number);
  if (existingFlight) {
    return next(new AppError('Flight with this flight number already exists', 400));
  }

  // Set available_seats equal to total_seats if not provided
  if (!flightData.available_seats) {
    flightData.available_seats = flightData.total_seats;
  }

  const flight = await FlightModel.create(flightData);

  res.status(201).json({
    status: 'success',
    data: {
      flight
    }
  });
});

/**
 * @desc    Update flight
 * @route   PUT /api/flights/:id
 * @access  Private (Admin only)
 */
export const updateFlight = asyncHandler(async (req, res, next) => {
  const flight = await FlightModel.findById(req.params.id);

  if (!flight) {
    return next(new AppError('Flight not found', 404));
  }

  const updatedFlight = await FlightModel.update(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: {
      flight: updatedFlight
    }
  });
});

/**
 * @desc    Delete flight
 * @route   DELETE /api/flights/:id
 * @access  Private (Admin only)
 */
export const deleteFlight = asyncHandler(async (req, res, next) => {
  const flight = await FlightModel.findById(req.params.id);

  if (!flight) {
    return next(new AppError('Flight not found', 404));
  }

  await FlightModel.delete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Flight deleted successfully'
  });
});
