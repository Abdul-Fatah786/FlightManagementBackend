import sql from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initialize database tables
 */
const initDatabase = async () => {
  try {
    console.log('🔄 Starting database initialization...');

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'passenger' CHECK (role IN ('passenger', 'admin')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Users table created');

    // Create flights table
    await sql`
      CREATE TABLE IF NOT EXISTS flights (
        id SERIAL PRIMARY KEY,
        flight_number VARCHAR(20) UNIQUE NOT NULL,
        airline VARCHAR(100) NOT NULL,
        origin VARCHAR(100) NOT NULL,
        destination VARCHAR(100) NOT NULL,
        departure_time TIMESTAMP NOT NULL,
        arrival_time TIMESTAMP NOT NULL,
        total_seats INTEGER NOT NULL,
        available_seats INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'boarding', 'departed', 'arrived', 'cancelled', 'delayed')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Flights table created');

    // Create passengers table
    await sql`
      CREATE TABLE IF NOT EXISTS passengers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        date_of_birth DATE NOT NULL,
        passport_number VARCHAR(50) UNIQUE NOT NULL,
        nationality VARCHAR(100) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Passengers table created');

    // Create bookings table
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        booking_reference VARCHAR(20) UNIQUE NOT NULL DEFAULT 'BK' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)),
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        flight_id INTEGER NOT NULL REFERENCES flights(id) ON DELETE CASCADE,
        passenger_id INTEGER NOT NULL REFERENCES passengers(id) ON DELETE CASCADE,
        seat_number VARCHAR(10),
        booking_class VARCHAR(20) DEFAULT 'economy' CHECK (booking_class IN ('economy', 'business', 'first')),
        status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Bookings table created');

    // Create indexes for better query performance
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_flights_number ON flights(flight_number)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_flights_origin_dest ON flights(origin, destination)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_flights_departure ON flights(departure_time)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_flight ON bookings(flight_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_passengers_user ON passengers(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_passengers_passport ON passengers(passport_number)`;
    console.log('✅ Indexes created');

    console.log('🎉 Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// Run initialization
initDatabase();
