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

    let query;

    // Build query based on provided filters
    if (origin && destination && departure_date && airline) {
      query = sql`
        SELECT * FROM flights
        WHERE status = ${status}
        AND LOWER(origin) = LOWER(${origin})
        AND LOWER(destination) = LOWER(${destination})
        AND DATE(departure_time) = ${departure_date}
        AND LOWER(airline) = LOWER(${airline})
        ORDER BY departure_time ASC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (origin && destination && departure_date) {
      query = sql`
        SELECT * FROM flights
        WHERE status = ${status}
        AND LOWER(origin) = LOWER(${origin})
        AND LOWER(destination) = LOWER(${destination})
        AND DATE(departure_time) = ${departure_date}
        ORDER BY departure_time ASC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (origin && destination) {
      query = sql`
        SELECT * FROM flights
        WHERE status = ${status}
        AND LOWER(origin) = LOWER(${origin})
        AND LOWER(destination) = LOWER(${destination})
        ORDER BY departure_time ASC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (origin) {
      query = sql`
        SELECT * FROM flights
        WHERE status = ${status}
        AND LOWER(origin) = LOWER(${origin})
        ORDER BY departure_time ASC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (destination) {
      query = sql`
        SELECT * FROM flights
        WHERE status = ${status}
        AND LOWER(destination) = LOWER(${destination})
        ORDER BY departure_time ASC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (departure_date) {
      query = sql`
        SELECT * FROM flights
        WHERE status = ${status}
        AND DATE(departure_time) = ${departure_date}
        ORDER BY departure_time ASC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (airline) {
      query = sql`
        SELECT * FROM flights
        WHERE status = ${status}
        AND LOWER(airline) = LOWER(${airline})
        ORDER BY departure_time ASC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      query = sql`
        SELECT * FROM flights
        WHERE status = ${status}
        ORDER BY departure_time ASC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

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
