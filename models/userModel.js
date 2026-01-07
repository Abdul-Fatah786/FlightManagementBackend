import sql from '../config/database.js';

export const UserModel = {
  /**
   * Create a new user
   */
  async create(userData) {
    const { email, password, name, phone, role = 'passenger' } = userData;
    const result = await sql`
      INSERT INTO users (email, password, name, phone, role)
      VALUES (${email}, ${password}, ${name}, ${phone}, ${role})
      RETURNING id, email, name, phone, role, created_at
    `;
    return result[0];
  },

  /**
   * Find user by email
   */
  async findByEmail(email) {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    return result[0];
  },

  /**
   * Find user by ID
   */
  async findById(id) {
    const result = await sql`
      SELECT id, email, name, phone, role, created_at, updated_at
      FROM users WHERE id = ${id}
    `;
    return result[0];
  },

  /**
   * Update user
   */
  async update(id, userData) {
    const { name, phone } = userData;
    const result = await sql`
      UPDATE users
      SET name = ${name}, phone = ${phone}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, email, name, phone, role, created_at, updated_at
    `;
    return result[0];
  },

  /**
   * Delete user
   */
  async delete(id) {
    const result = await sql`
      DELETE FROM users WHERE id = ${id}
      RETURNING id
    `;
    return result[0];
  },

  /**
   * Get all users (admin only)
   */
  async findAll(filters = {}) {
    const { role, limit = 50, offset = 0 } = filters;
    
    if (role) {
      return await sql`
        SELECT id, email, name, phone, role, created_at, updated_at
        FROM users WHERE role = ${role}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }
    
    return await sql`
      SELECT id, email, name, phone, role, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  }
};
