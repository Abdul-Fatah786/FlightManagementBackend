import sql from '../config/database.js';

export const BookingModel = {
  /**
   * Create a new booking
   */
  async create(bookingData) {
    const {
      user_id,
      flight_id,
      passenger_id,
      seat_number,
      booking_class = 'economy',
      status = 'confirmed'
    } = bookingData;

    const result = await sql`
      INSERT INTO bookings (
        user_id, flight_id, passenger_id, seat_number,
        booking_class, status
      )
      VALUES (
        ${user_id}, ${flight_id}, ${passenger_id}, ${seat_number},
        ${booking_class}, ${status}
      )
      RETURNING *
    `;
    return result[0];
  },

  /**
   * Find booking by ID
   */
  async findById(id) {
    const result = await sql`
      SELECT
        b.*,
        u.name as user_name, u.email as user_email,
        f.flight_number, f.airline, f.origin, f.destination,
        f.departure_time, f.arrival_time, f.price,
        p.first_name, p.last_name, p.passport_number
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN flights f ON b.flight_id = f.id
      JOIN passengers p ON b.passenger_id = p.id
      WHERE b.id = ${id}
    `;
    return result[0];
  },

  /**
   * Find booking by booking reference
   */
  async findByReference(bookingReference) {
    const result = await sql`
      SELECT
        b.*,
        u.name as user_name, u.email as user_email,
        f.flight_number, f.airline, f.origin, f.destination,
        f.departure_time, f.arrival_time, f.price,
        p.first_name, p.last_name, p.passport_number
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN flights f ON b.flight_id = f.id
      JOIN passengers p ON b.passenger_id = p.id
      WHERE b.booking_reference = ${bookingReference}
    `;
    return result[0];
  },

  /**
   * Get all bookings for a user
   */
  async findByUserId(userId, filters = {}) {
    const { status, limit = 50, offset = 0 } = filters;

    if (status) {
      return await sql`
        SELECT
          b.*,
          f.flight_number, f.airline, f.origin, f.destination,
          f.departure_time, f.arrival_time, f.price, f.status as flight_status,
          p.first_name, p.last_name, p.passport_number
        FROM bookings b
        JOIN flights f ON b.flight_id = f.id
        JOIN passengers p ON b.passenger_id = p.id
        WHERE b.user_id = ${userId} AND b.status = ${status}
        ORDER BY b.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    return await sql`
      SELECT
        b.*,
        f.flight_number, f.airline, f.origin, f.destination,
        f.departure_time, f.arrival_time, f.price, f.status as flight_status,
        p.first_name, p.last_name, p.passport_number
      FROM bookings b
      JOIN flights f ON b.flight_id = f.id
      JOIN passengers p ON b.passenger_id = p.id
      WHERE b.user_id = ${userId}
      ORDER BY b.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  },

  /**
   * Get all bookings for a flight
   */
  async findByFlightId(flightId) {
    return await sql`
      SELECT
        b.*,
        u.name as user_name, u.email as user_email,
        p.first_name, p.last_name, p.passport_number
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN passengers p ON b.passenger_id = p.id
      WHERE b.flight_id = ${flightId}
      ORDER BY b.created_at DESC
    `;
  },

  /**
   * Get all bookings (admin)
   */
  async findAll(filters = {}) {
    const { status, limit = 50, offset = 0 } = filters;

    if (status) {
      return await sql`
        SELECT
          b.*,
          u.name as user_name, u.email as user_email,
          f.flight_number, f.airline, f.origin, f.destination,
          f.departure_time, f.arrival_time,
          p.first_name, p.last_name
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN flights f ON b.flight_id = f.id
        JOIN passengers p ON b.passenger_id = p.id
        WHERE b.status = ${status}
        ORDER BY b.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    return await sql`
      SELECT
        b.*,
        u.name as user_name, u.email as user_email,
        f.flight_number, f.airline, f.origin, f.destination,
        f.departure_time, f.arrival_time,
        p.first_name, p.last_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN flights f ON b.flight_id = f.id
      JOIN passengers p ON b.passenger_id = p.id
      ORDER BY b.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  },

  /**
   * Update booking status
   */
  async updateStatus(id, status) {
    const result = await sql`
      UPDATE bookings
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  },

  /**
   * Cancel booking
   */
  async cancel(id) {
    return await this.updateStatus(id, 'cancelled');
  },

  /**
   * Delete booking
   */
  async delete(id) {
    const result = await sql`
      DELETE FROM bookings WHERE id = ${id}
      RETURNING id, flight_id
    `;
    return result[0];
  }
};
