# Flight Management System Backend

A comprehensive Express.js backend for Flight Management System using Neon Postgres database.

## 🚀 Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control (Passenger, Admin)
- **Flight Management**: Create, update, search, and manage flights
- **Booking System**: Book flights, manage bookings, cancel reservations
- **Passenger Management**: Add and manage passenger information
- **Admin Dashboard**: Comprehensive admin controls for managing users, flights, and bookings

## 📋 Prerequisites

- Node.js (v18 or higher)
- Neon Postgres Database account
- npm or yarn

## 🛠️ Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` file with your Neon Postgres credentials:
```env
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
JWT_SECRET=your-super-secret-jwt-key
PORT=3000
NODE_ENV=development
```

5. Initialize the database:
```bash
npm run init-db
```

## 🏃‍♂️ Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Flights
- `GET /api/flights` - Get all flights
- `GET /api/flights/search` - Search flights
- `GET /api/flights/:id` - Get flight by ID
- `POST /api/flights` - Create flight (Admin)
- `PUT /api/flights/:id` - Update flight (Admin)
- `DELETE /api/flights/:id` - Delete flight (Admin)

### Bookings
- `POST /api/bookings` - Create booking (Protected)
- `GET /api/bookings` - Get user's bookings (Protected)
- `GET /api/bookings/:id` - Get booking by ID (Protected)
- `GET /api/bookings/reference/:reference` - Get booking by reference (Protected)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (Protected)
- `DELETE /api/bookings/:id` - Delete booking (Admin)

### Passengers
- `POST /api/passengers` - Create passenger (Protected)
- `GET /api/passengers` - Get user's passengers (Protected)
- `GET /api/passengers/:id` - Get passenger by ID (Protected)
- `PUT /api/passengers/:id` - Update passenger (Protected)
- `DELETE /api/passengers/:id` - Delete passenger (Protected)

### Users
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)

### Admin
- `GET /api/admin/users` - Get all users (Admin)
- `GET /api/admin/bookings` - Get all bookings (Admin)
- `GET /api/admin/passengers` - Get all passengers (Admin)
- `GET /api/admin/flights/:id/bookings` - Get flight bookings (Admin)
- `DELETE /api/admin/users/:id` - Delete user (Admin)

## 📊 Database Schema

### Users
- id, email, password, name, phone, role, timestamps

### Flights
- id, flight_number, airline, origin, destination, departure_time, arrival_time, total_seats, available_seats, price, status, timestamps

### Passengers
- id, user_id, first_name, last_name, date_of_birth, passport_number, nationality, email, phone, timestamps

### Bookings
- id, booking_reference, user_id, flight_id, passenger_id, seat_number, booking_class, status, timestamps

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## 🧪 Testing

You can test the API using tools like:
- Postman
- Thunder Client (VS Code extension)
- curl

Example registration request:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "phone": "+1234567890"
  }'
```

## 📝 License

ISC
