import sql from '../config/database.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Seed database with realistic sample data
 */
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // 1. Create Admin User
    console.log('\n👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminResult = await sql`
      INSERT INTO users (email, password, name, phone, role)
      VALUES (
        'admin@flightmanagement.com',
        ${adminPassword},
        'Admin User',
        '+1-555-0100',
        'admin'
      )
      ON CONFLICT (email) DO UPDATE 
      SET password = ${adminPassword}
      RETURNING id, email, name, role
    `;
    console.log('✅ Admin created:', adminResult[0]);

    // 2. Create Sample Passengers (Users)
    console.log('\n👥 Creating passenger users...');
    const passengers = [
      { email: 'john.doe@email.com', password: 'password123', name: 'John Doe', phone: '+1-555-0101' },
      { email: 'jane.smith@email.com', password: 'password123', name: 'Jane Smith', phone: '+1-555-0102' },
      { email: 'robert.johnson@email.com', password: 'password123', name: 'Robert Johnson', phone: '+1-555-0103' },
      { email: 'maria.garcia@email.com', password: 'password123', name: 'Maria Garcia', phone: '+1-555-0104' },
      { email: 'david.wilson@email.com', password: 'password123', name: 'David Wilson', phone: '+1-555-0105' }
    ];

    const userIds = [];
    for (const passenger of passengers) {
      const hashedPassword = await bcrypt.hash(passenger.password, 10);
      const result = await sql`
        INSERT INTO users (email, password, name, phone, role)
        VALUES (
          ${passenger.email},
          ${hashedPassword},
          ${passenger.name},
          ${passenger.phone},
          'passenger'
        )
        ON CONFLICT (email) DO UPDATE 
        SET password = ${hashedPassword}
        RETURNING id, email, name
      `;
      userIds.push(result[0].id);
      console.log(`✅ User created: ${result[0].name} (${result[0].email})`);
    }

    // 3. Create Sample Flights
    console.log('\n✈️  Creating sample flights...');
    const flights = [
      {
        flight_number: 'FM101',
        airline: 'SkyWings Airlines',
        origin: 'New York (JFK)',
        destination: 'London (LHR)',
        departure_time: '2026-02-15 10:00:00',
        arrival_time: '2026-02-15 22:00:00',
        total_seats: 180,
        available_seats: 150,
        price: 599.99,
        status: 'scheduled'
      },
      {
        flight_number: 'FM102',
        airline: 'SkyWings Airlines',
        origin: 'Los Angeles (LAX)',
        destination: 'Tokyo (NRT)',
        departure_time: '2026-02-16 14:30:00',
        arrival_time: '2026-02-17 18:30:00',
        total_seats: 220,
        available_seats: 200,
        price: 899.99,
        status: 'scheduled'
      },
      {
        flight_number: 'FM103',
        airline: 'Global Airways',
        origin: 'Chicago (ORD)',
        destination: 'Paris (CDG)',
        departure_time: '2026-02-17 09:15:00',
        arrival_time: '2026-02-17 23:45:00',
        total_seats: 200,
        available_seats: 180,
        price: 649.99,
        status: 'scheduled'
      },
      {
        flight_number: 'FM104',
        airline: 'Global Airways',
        origin: 'San Francisco (SFO)',
        destination: 'Singapore (SIN)',
        departure_time: '2026-02-18 11:00:00',
        arrival_time: '2026-02-19 19:00:00',
        total_seats: 250,
        available_seats: 230,
        price: 1099.99,
        status: 'scheduled'
      },
      {
        flight_number: 'FM105',
        airline: 'Pacific Air',
        origin: 'Miami (MIA)',
        destination: 'Dubai (DXB)',
        departure_time: '2026-02-19 16:45:00',
        arrival_time: '2026-02-20 13:15:00',
        total_seats: 280,
        available_seats: 250,
        price: 799.99,
        status: 'scheduled'
      },
      {
        flight_number: 'FM106',
        airline: 'Pacific Air',
        origin: 'Boston (BOS)',
        destination: 'Rome (FCO)',
        departure_time: '2026-02-20 08:30:00',
        arrival_time: '2026-02-20 21:00:00',
        total_seats: 160,
        available_seats: 140,
        price: 579.99,
        status: 'scheduled'
      },
      {
        flight_number: 'FM107',
        airline: 'Continental Express',
        origin: 'Seattle (SEA)',
        destination: 'Sydney (SYD)',
        departure_time: '2026-02-21 13:00:00',
        arrival_time: '2026-02-23 06:00:00',
        total_seats: 240,
        available_seats: 220,
        price: 1299.99,
        status: 'scheduled'
      },
      {
        flight_number: 'FM108',
        airline: 'Continental Express',
        origin: 'Denver (DEN)',
        destination: 'Amsterdam (AMS)',
        departure_time: '2026-02-22 10:45:00',
        arrival_time: '2026-02-23 04:15:00',
        total_seats: 190,
        available_seats: 170,
        price: 689.99,
        status: 'scheduled'
      },
      {
        flight_number: 'FM109',
        airline: 'Oceanic Airlines',
        origin: 'Houston (IAH)',
        destination: 'Barcelona (BCN)',
        departure_time: '2026-02-23 15:20:00',
        arrival_time: '2026-02-24 07:50:00',
        total_seats: 210,
        available_seats: 190,
        price: 629.99,
        status: 'scheduled'
      },
      {
        flight_number: 'FM110',
        airline: 'Oceanic Airlines',
        origin: 'Atlanta (ATL)',
        destination: 'Hong Kong (HKG)',
        departure_time: '2026-02-24 12:00:00',
        arrival_time: '2026-02-25 18:30:00',
        total_seats: 260,
        available_seats: 240,
        price: 999.99,
        status: 'scheduled'
      },
      {
        flight_number: 'FM201',
        airline: 'SkyWings Airlines',
        origin: 'London (LHR)',
        destination: 'New York (JFK)',
        departure_time: '2026-02-16 11:00:00',
        arrival_time: '2026-02-16 14:00:00',
        total_seats: 180,
        available_seats: 160,
        price: 599.99,
        status: 'scheduled'
      },
      {
        flight_number: 'FM202',
        airline: 'Global Airways',
        origin: 'Paris (CDG)',
        destination: 'Toronto (YYZ)',
        departure_time: '2026-02-17 14:30:00',
        arrival_time: '2026-02-17 17:30:00',
        total_seats: 200,
        available_seats: 185,
        price: 549.99,
        status: 'scheduled'
      },
      // LAX to FAX flights
      {
        flight_number: 'FM301',
        airline: 'SkyWings Airlines',
        origin: 'LAX',
        destination: 'FAX',
        departure_time: '2026-01-17 08:00:00',
        arrival_time: '2026-01-17 12:00:00',
        total_seats: 180,
        available_seats: 150,
        price: 299.99,
        status: 'scheduled'
      },
      {
        flight_number: 'FM302',
        airline: 'Global Airways',
        origin: 'LAX',
        destination: 'FAX',
        departure_time: '2026-01-17 14:30:00',
        arrival_time: '2026-01-17 18:30:00',
        total_seats: 200,
        available_seats: 180,
        price: 349.99,
        status: 'scheduled'
      },
      {
        flight_number: 'FM303',
        airline: 'Pacific Air',
        origin: 'LAX',
        destination: 'FAX',
        departure_time: '2026-01-17 20:00:00',
        arrival_time: '2026-01-18 00:00:00',
        total_seats: 160,
        available_seats: 140,
        price: 279.99,
        status: 'scheduled'
      },
      {
        flight_number: 'FM304',
        airline: 'SkyWings Airlines',
        origin: 'LAX',
        destination: 'FAX',
        departure_time: '2026-01-18 09:30:00',
        arrival_time: '2026-01-18 13:30:00',
        total_seats: 180,
        available_seats: 160,
        price: 299.99,
        status: 'scheduled'
      },
      {
        flight_number: 'FM305',
        airline: 'Continental Express',
        origin: 'LAX',
        destination: 'FAX',
        departure_time: '2026-01-16 10:00:00',
        arrival_time: '2026-01-16 14:00:00',
        total_seats: 190,
        available_seats: 170,
        price: 319.99,
        status: 'scheduled'
      }
    ];

    const flightIds = [];
    for (const flight of flights) {
      const result = await sql`
        INSERT INTO flights (
          flight_number, airline, origin, destination,
          departure_time, arrival_time, total_seats, available_seats,
          price, status
        )
        VALUES (
          ${flight.flight_number}, ${flight.airline}, ${flight.origin}, ${flight.destination},
          ${flight.departure_time}, ${flight.arrival_time}, ${flight.total_seats}, ${flight.available_seats},
          ${flight.price}, ${flight.status}
        )
        ON CONFLICT (flight_number) DO UPDATE
        SET 
          airline = ${flight.airline},
          origin = ${flight.origin},
          destination = ${flight.destination},
          departure_time = ${flight.departure_time},
          arrival_time = ${flight.arrival_time},
          total_seats = ${flight.total_seats},
          available_seats = ${flight.available_seats},
          price = ${flight.price},
          status = ${flight.status}
        RETURNING id, flight_number, origin, destination, price
      `;
      flightIds.push(result[0].id);
      console.log(`✅ Flight created: ${result[0].flight_number} (${result[0].origin} → ${result[0].destination}) - $${result[0].price}`);
    }

    // 4. Create Sample Passenger Profiles
    console.log('\n🛂 Creating passenger profiles...');
    const passengerProfiles = [
      {
        user_id: userIds[0],
        first_name: 'John',
        last_name: 'Doe',
        date_of_birth: '1985-05-15',
        passport_number: 'US123456789',
        nationality: 'United States',
        email: 'john.doe@email.com',
        phone: '+1-555-0101'
      },
      {
        user_id: userIds[1],
        first_name: 'Jane',
        last_name: 'Smith',
        date_of_birth: '1990-08-22',
        passport_number: 'US987654321',
        nationality: 'United States',
        email: 'jane.smith@email.com',
        phone: '+1-555-0102'
      },
      {
        user_id: userIds[2],
        first_name: 'Robert',
        last_name: 'Johnson',
        date_of_birth: '1978-03-10',
        passport_number: 'US456789123',
        nationality: 'United States',
        email: 'robert.johnson@email.com',
        phone: '+1-555-0103'
      },
      {
        user_id: userIds[3],
        first_name: 'Maria',
        last_name: 'Garcia',
        date_of_birth: '1995-11-30',
        passport_number: 'ES789456123',
        nationality: 'Spain',
        email: 'maria.garcia@email.com',
        phone: '+34-555-0104'
      },
      {
        user_id: userIds[4],
        first_name: 'David',
        last_name: 'Wilson',
        date_of_birth: '1982-07-18',
        passport_number: 'GB654321987',
        nationality: 'United Kingdom',
        email: 'david.wilson@email.com',
        phone: '+44-555-0105'
      }
    ];

    const passengerIds = [];
    for (const passenger of passengerProfiles) {
      const result = await sql`
        INSERT INTO passengers (
          user_id, first_name, last_name, date_of_birth,
          passport_number, nationality, email, phone
        )
        VALUES (
          ${passenger.user_id}, ${passenger.first_name}, ${passenger.last_name}, ${passenger.date_of_birth},
          ${passenger.passport_number}, ${passenger.nationality}, ${passenger.email}, ${passenger.phone}
        )
        ON CONFLICT (passport_number) DO UPDATE
        SET 
          first_name = ${passenger.first_name},
          last_name = ${passenger.last_name},
          email = ${passenger.email},
          phone = ${passenger.phone}
        RETURNING id, first_name, last_name, passport_number
      `;
      passengerIds.push(result[0].id);
      console.log(`✅ Passenger profile created: ${result[0].first_name} ${result[0].last_name} (${result[0].passport_number})`);
    }

    // 5. Create Sample Bookings
    console.log('\n🎫 Creating sample bookings...');
    const bookings = [
      {
        user_id: userIds[0],
        flight_id: flightIds[0],
        passenger_id: passengerIds[0],
        seat_number: '12A',
        booking_class: 'economy',
        status: 'confirmed'
      },
      {
        user_id: userIds[1],
        flight_id: flightIds[1],
        passenger_id: passengerIds[1],
        seat_number: '8B',
        booking_class: 'business',
        status: 'confirmed'
      },
      {
        user_id: userIds[2],
        flight_id: flightIds[2],
        passenger_id: passengerIds[2],
        seat_number: '15C',
        booking_class: 'economy',
        status: 'confirmed'
      },
      {
        user_id: userIds[3],
        flight_id: flightIds[3],
        passenger_id: passengerIds[3],
        seat_number: '3A',
        booking_class: 'first',
        status: 'confirmed'
      },
      {
        user_id: userIds[4],
        flight_id: flightIds[4],
        passenger_id: passengerIds[4],
        seat_number: '20D',
        booking_class: 'economy',
        status: 'confirmed'
      }
    ];

    for (const booking of bookings) {
      const result = await sql`
        INSERT INTO bookings (
          user_id, flight_id, passenger_id, seat_number,
          booking_class, status
        )
        VALUES (
          ${booking.user_id}, ${booking.flight_id}, ${booking.passenger_id}, ${booking.seat_number},
          ${booking.booking_class}, ${booking.status}
        )
        RETURNING id, booking_reference, seat_number, booking_class
      `;
      console.log(`✅ Booking created: ${result[0].booking_reference} (Seat ${result[0].seat_number}, ${result[0].booking_class})`);
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - 1 Admin user created`);
    console.log(`   - ${passengers.length} Passenger users created`);
    console.log(`   - ${flights.length} Flights created`);
    console.log(`   - ${passengerProfiles.length} Passenger profiles created`);
    console.log(`   - ${bookings.length} Bookings created`);
    
    console.log('\n🔐 Login Credentials:');
    console.log('\n   Admin:');
    console.log('   Email: admin@flightmanagement.com');
    console.log('   Password: admin123');
    console.log('\n   Sample Passengers:');
    console.log('   Email: john.doe@email.com');
    console.log('   Password: password123');
    console.log('\n   (All sample users have password: password123)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();
