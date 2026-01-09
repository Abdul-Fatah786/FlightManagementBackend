import sql from '../config/database.js';

export const FlightModel = {
  /**
   * Create a new flight
   */
  async create(flightData) {
    const {
      flight_number,
      airline,
      origin,
      destination,
      departure_time,
      arrival_time,
      total_seats,
      available_seats,
      price,
      status = 'scheduled'
    } = flightData;

    const result = await sql`
      INSERT INTO flights (
        flight_number, airline, origin, destination,
        departure_time, arrival_time, total_seats, available_seats,
        price, status
      )
      VALUES (
        ${flight_number}, ${airline}, ${origin}, ${destination},
        ${departure_time}, ${arrival_time}, ${total_seats}, ${available_seats},
        ${price}, ${status}
      )
      RETURNING *
    `;
    return result[0];
  },

  /**
   * Find flight by ID
   */
  async findById(id) {
    const result = await sql`
      SELECT * FROM flights WHERE id = ${id}
    `;
    return result[0];
  },

  /**
   * Find flight by flight number
   */
  async findByFlightNumber(flightNumber) {
    const result = await sql`
      SELECT * FROM flights WHERE flight_number = ${flightNumber}
    `;
    return result[0];
  },

  /**
   * Search flights
   */
  async search(filters = {}) {
    const {
      origin,
      destination,
      departure_date,
      airline,
      status = 'scheduled',
      limit = 50,
      offset = 0
    } = filters;

    // Build query dynamically based on provided filters
    let conditions = [`status = ${status}`];
    let params = {};

    if (origin) {
      conditions.push(`LOWER(origin) = LOWER(${origin})`);
    }

    if (destination) {
      conditions.push(`LOWER(destination) = LOWER(${destination})`);
    }

    if (departure_date) {
      conditions.push(`DATE(departure_time) = ${departure_date}`);
    }

    if (airline) {
      conditions.push(`LOWER(airline) = LOWER(${airline})`);
    }

    // Execute query with all conditions
    const query = sql`
      SELECT * FROM flights
      WHERE status = ${status}
      ${origin ? sql`AND LOWER(origin) = LOWER(${origin})` : sql``}
      ${destination ? sql`AND LOWER(destination) = LOWER(${destination})` : sql``}
      ${departure_date ? sql`AND DATE(departure_time) = ${departure_date}` : sql``}
      ${airline ? sql`AND LOWER(airline) = LOWER(${airline})` : sql``}
      ORDER BY departure_time ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const flights = await query;
    return flights;
  },

  /**
   * Get all flights
   */
  async findAll(filters = {}) {
    const { status, limit = 50, offset = 0 } = filters;

    if (status) {
      return await sql`
        SELECT * FROM flights
        WHERE status = ${status}
        ORDER BY departure_time ASC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    return await sql`
      SELECT * FROM flights
      ORDER BY departure_time ASC
      LIMIT ${limit} OFFSET ${offset}
    `;
  },

  /**
   * Update flight
   */
  async update(id, flightData) {
    const {
      flight_number,
      airline,
      origin,
      destination,
      departure_time,
      arrival_time,
      total_seats,
      available_seats,
      price,
      status
    } = flightData;

    const result = await sql`
      UPDATE flights
      SET
        flight_number = ${flight_number},
        airline = ${airline},
        origin = ${origin},
        destination = ${destination},
        departure_time = ${departure_time},
        arrival_time = ${arrival_time},
        total_seats = ${total_seats},
        available_seats = ${available_seats},
        price = ${price},
        status = ${status},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  },

  /**
   * Update available seats
   */
  async updateAvailableSeats(id, change) {
    const result = await sql`
      UPDATE flights
      SET available_seats = available_seats + ${change},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  },

  /**
   * Delete flight
   */
  async delete(id) {
    const result = await sql`
      DELETE FROM flights WHERE id = ${id}
      RETURNING id
    `;
    return result[0];
  }
};
