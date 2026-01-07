import sql from '../config/database.js';

export const PassengerModel = {
  /**
   * Create a new passenger
   */
  async create(passengerData) {
    const {
      user_id,
      first_name,
      last_name,
      date_of_birth,
      passport_number,
      nationality,
      email,
      phone
    } = passengerData;

    const result = await sql`
      INSERT INTO passengers (
        user_id, first_name, last_name, date_of_birth,
        passport_number, nationality, email, phone
      )
      VALUES (
        ${user_id}, ${first_name}, ${last_name}, ${date_of_birth},
        ${passport_number}, ${nationality}, ${email}, ${phone}
      )
      RETURNING *
    `;
    return result[0];
  },

  /**
   * Find passenger by ID
   */
  async findById(id) {
    const result = await sql`
      SELECT * FROM passengers WHERE id = ${id}
    `;
    return result[0];
  },

  /**
   * Find passenger by passport number
   */
  async findByPassport(passportNumber) {
    const result = await sql`
      SELECT * FROM passengers WHERE passport_number = ${passportNumber}
    `;
    return result[0];
  },

  /**
   * Get all passengers for a user
   */
  async findByUserId(userId) {
    return await sql`
      SELECT * FROM passengers
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
  },

  /**
   * Get all passengers (admin)
   */
  async findAll(filters = {}) {
    const { limit = 50, offset = 0 } = filters;
    
    return await sql`
      SELECT
        p.*,
        u.name as user_name, u.email as user_email
      FROM passengers p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  },

  /**
   * Update passenger
   */
  async update(id, passengerData) {
    const {
      first_name,
      last_name,
      date_of_birth,
      passport_number,
      nationality,
      email,
      phone
    } = passengerData;

    const result = await sql`
      UPDATE passengers
      SET
        first_name = ${first_name},
        last_name = ${last_name},
        date_of_birth = ${date_of_birth},
        passport_number = ${passport_number},
        nationality = ${nationality},
        email = ${email},
        phone = ${phone},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  },

  /**
   * Delete passenger
   */
  async delete(id) {
    const result = await sql`
      DELETE FROM passengers WHERE id = ${id}
      RETURNING id
    `;
    return result[0];
  }
};
