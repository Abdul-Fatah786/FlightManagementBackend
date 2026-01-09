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

### Authentication Routes

#### 1. Register New User
- **URL**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890",
  "role": "passenger"  // Optional: "passenger" (default) or "admin"
}
```
- **Success Response** (201):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "role": "passenger"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. Login User
- **URL**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "role": "passenger"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 3. Get Current User
- **URL**: `GET /api/auth/me`
- **Access**: Protected (Requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "role": "passenger",
      "created_at": "2026-01-09T10:00:00.000Z",
      "updated_at": "2026-01-09T10:00:00.000Z"
    }
  }
}
```

---

### Flight Routes

#### 1. Get All Flights
- **URL**: `GET /api/flights`
- **Access**: Public
- **Query Parameters** (Optional):
  - `status`: Filter by status (scheduled, delayed, cancelled, completed)
  - `limit`: Number of results to return
  - `offset`: Number of results to skip
- **Example**: `GET /api/flights?status=scheduled&limit=10&offset=0`
- **Success Response** (200):
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "flights": [
      {
        "id": 1,
        "flight_number": "AA123",
        "airline": "American Airlines",
        "origin": "New York (JFK)",
        "destination": "Los Angeles (LAX)",
        "departure_time": "2026-01-15T10:00:00.000Z",
        "arrival_time": "2026-01-15T13:00:00.000Z",
        "total_seats": 200,
        "available_seats": 150,
        "price": 250.00,
        "status": "scheduled",
        "created_at": "2026-01-09T10:00:00.000Z",
        "updated_at": "2026-01-09T10:00:00.000Z"
      }
    ]
  }
}
```

#### 2. Search Flights
- **URL**: `GET /api/flights/search`
- **Access**: Public
- **Query Parameters** (Required):
  - `origin`: Departure location
  - `destination`: Arrival location
- **Query Parameters** (Optional):
  - `departure_date`: Date of departure (YYYY-MM-DD)
  - `airline`: Filter by airline name
  - `status`: Filter by flight status
- **Example**: `GET /api/flights/search?origin=New York&destination=Los Angeles&departure_date=2026-01-15`
- **Success Response** (200):
```json
{
  "status": "success",
  "results": 3,
  "data": {
    "flights": [...]
  }
}
```

#### 3. Get Flight by ID
- **URL**: `GET /api/flights/:id`
- **Access**: Public
- **Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "flight": {
      "id": 1,
      "flight_number": "AA123",
      "airline": "American Airlines",
      "origin": "New York (JFK)",
      "destination": "Los Angeles (LAX)",
      "departure_time": "2026-01-15T10:00:00.000Z",
      "arrival_time": "2026-01-15T13:00:00.000Z",
      "total_seats": 200,
      "available_seats": 150,
      "price": 250.00,
      "status": "scheduled",
      "created_at": "2026-01-09T10:00:00.000Z",
      "updated_at": "2026-01-09T10:00:00.000Z"
    }
  }
}
```

#### 4. Create Flight (Admin Only)
- **URL**: `POST /api/flights`
- **Access**: Protected (Admin role required)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "flight_number": "AA123",
  "airline": "American Airlines",
  "origin": "New York (JFK)",
  "destination": "Los Angeles (LAX)",
  "departure_time": "2026-01-15T10:00:00.000Z",
  "arrival_time": "2026-01-15T13:00:00.000Z",
  "total_seats": 200,
  "available_seats": 200,  // Optional: defaults to total_seats
  "price": 250.00,
  "status": "scheduled"  // Optional: defaults to "scheduled"
}
```
- **Success Response** (201):
```json
{
  "status": "success",
  "data": {
    "flight": {
      "id": 1,
      "flight_number": "AA123",
      ...
    }
  }
}
```

#### 5. Update Flight (Admin Only)
- **URL**: `PUT /api/flights/:id`
- **Access**: Protected (Admin role required)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body** (All fields optional):
```json
{
  "airline": "American Airlines",
  "origin": "New York (JFK)",
  "destination": "Los Angeles (LAX)",
  "departure_time": "2026-01-15T10:00:00.000Z",
  "arrival_time": "2026-01-15T13:00:00.000Z",
  "total_seats": 200,
  "available_seats": 150,
  "price": 250.00,
  "status": "scheduled"
}
```
- **Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "flight": {
      "id": 1,
      ...
    }
  }
}
```

#### 6. Delete Flight (Admin Only)
- **URL**: `DELETE /api/flights/:id`
- **Access**: Protected (Admin role required)
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200):
```json
{
  "status": "success",
  "message": "Flight deleted successfully"
}
```

---

### Booking Routes

#### 1. Create Booking
- **URL**: `POST /api/bookings`
- **Access**: Protected (Requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "flight_id": 1,
  "passenger_id": 1,
  "seat_number": "12A",
  "booking_class": "economy"  // Optional: "economy" (default), "business", "first"
}
```
- **Success Response** (201):
```json
{
  "status": "success",
  "data": {
    "booking": {
      "id": 1,
      "booking_reference": "BK1A2B3C4D",
      "user_id": 1,
      "flight_id": 1,
      "passenger_id": 1,
      "seat_number": "12A",
      "booking_class": "economy",
      "status": "confirmed",
      "user_name": "John Doe",
      "user_email": "user@example.com",
      "flight_number": "AA123",
      "airline": "American Airlines",
      "origin": "New York (JFK)",
      "destination": "Los Angeles (LAX)",
      "departure_time": "2026-01-15T10:00:00.000Z",
      "arrival_time": "2026-01-15T13:00:00.000Z",
      "price": 250.00,
      "first_name": "John",
      "last_name": "Doe",
      "passport_number": "P123456",
      "created_at": "2026-01-09T10:00:00.000Z",
      "updated_at": "2026-01-09T10:00:00.000Z"
    }
  }
}
```

#### 2. Get My Bookings
- **URL**: `GET /api/bookings`
- **Access**: Protected (Requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters** (Optional):
  - `status`: Filter by status (confirmed, cancelled, completed)
  - `limit`: Number of results to return
  - `offset`: Number of results to skip
- **Example**: `GET /api/bookings?status=confirmed&limit=10`
- **Success Response** (200):
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "bookings": [
      {
        "id": 1,
        "booking_reference": "BK1A2B3C4D",
        "user_id": 1,
        "flight_id": 1,
        "passenger_id": 1,
        "seat_number": "12A",
        "booking_class": "economy",
        "status": "confirmed",
        "user_name": "John Doe",
        "user_email": "user@example.com",
        "flight_number": "AA123",
        "airline": "American Airlines",
        "origin": "New York (JFK)",
        "destination": "Los Angeles (LAX)",
        "departure_time": "2026-01-15T10:00:00.000Z",
        "arrival_time": "2026-01-15T13:00:00.000Z",
        "price": 250.00,
        "first_name": "John",
        "last_name": "Doe",
        "passport_number": "P123456",
        "created_at": "2026-01-09T10:00:00.000Z",
        "updated_at": "2026-01-09T10:00:00.000Z"
      }
    ]
  }
}
```

#### 3. Get Booking by ID
- **URL**: `GET /api/bookings/:id`
- **Access**: Protected (Requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "booking": {
      "id": 1,
      "booking_reference": "BK1A2B3C4D",
      ...
    }
  }
}
```

#### 4. Get Booking by Reference
- **URL**: `GET /api/bookings/reference/:reference`
- **Access**: Protected (Requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Example**: `GET /api/bookings/reference/BK1A2B3C4D`
- **Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "booking": {
      "id": 1,
      "booking_reference": "BK1A2B3C4D",
      ...
    }
  }
}
```

#### 5. Cancel Booking
- **URL**: `PATCH /api/bookings/:id/cancel`
- **Access**: Protected (Requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "booking": {
      "id": 1,
      "booking_reference": "BK1A2B3C4D",
      "status": "cancelled",
      ...
    }
  }
}
```

#### 6. Delete Booking (Admin Only)
- **URL**: `DELETE /api/bookings/:id`
- **Access**: Protected (Admin role required)
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200):
```json
{
  "status": "success",
  "message": "Booking deleted successfully"
}
```

---

### Passenger Routes

#### 1. Create Passenger
- **URL**: `POST /api/passengers`
- **Access**: Protected (Requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1990-01-15",
  "passport_number": "P123456789",
  "nationality": "USA",
  "email": "john.doe@example.com",
  "phone": "+1234567890"
}
```
- **Success Response** (201):
```json
{
  "status": "success",
  "data": {
    "passenger": {
      "id": 1,
      "user_id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "date_of_birth": "1990-01-15",
      "passport_number": "P123456789",
      "nationality": "USA",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "created_at": "2026-01-09T10:00:00.000Z",
      "updated_at": "2026-01-09T10:00:00.000Z"
    }
  }
}
```

#### 2. Get My Passengers
- **URL**: `GET /api/passengers`
- **Access**: Protected (Requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200):
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "passengers": [
      {
        "id": 1,
        "user_id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "date_of_birth": "1990-01-15",
        "passport_number": "P123456789",
        "nationality": "USA",
        "email": "john.doe@example.com",
        "phone": "+1234567890",
        "created_at": "2026-01-09T10:00:00.000Z",
        "updated_at": "2026-01-09T10:00:00.000Z"
      }
    ]
  }
}
```

#### 3. Get Passenger by ID
- **URL**: `GET /api/passengers/:id`
- **Access**: Protected (Requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "passenger": {
      "id": 1,
      "user_id": 1,
      "first_name": "John",
      "last_name": "Doe",
      ...
    }
  }
}
```

#### 4. Update Passenger
- **URL**: `PUT /api/passengers/:id`
- **Access**: Protected (Requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body** (All fields optional):
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1990-01-15",
  "passport_number": "P123456789",
  "nationality": "USA",
  "email": "john.doe@example.com",
  "phone": "+1234567890"
}
```
- **Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "passenger": {
      "id": 1,
      ...
    }
  }
}
```

#### 5. Delete Passenger
- **URL**: `DELETE /api/passengers/:id`
- **Access**: Protected (Requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200):
```json
{
  "status": "success",
  "message": "Passenger deleted successfully"
}
```

---

### User Routes

#### 1. Get User Profile
- **URL**: `GET /api/users/profile`
- **Access**: Protected (Requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "role": "passenger",
      "created_at": "2026-01-09T10:00:00.000Z",
      "updated_at": "2026-01-09T10:00:00.000Z"
    }
  }
}
```

#### 2. Update User Profile
- **URL**: `PUT /api/users/profile`
- **Access**: Protected (Requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "name": "John Doe Updated",
  "phone": "+1234567890"
}
```
- **Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe Updated",
      "phone": "+1234567890",
      "role": "passenger",
      "created_at": "2026-01-09T10:00:00.000Z",
      "updated_at": "2026-01-09T10:00:00.000Z"
    }
  }
}
```

---

### Admin Routes

#### 1. Get All Users (Admin Only)
- **URL**: `GET /api/admin/users`
- **Access**: Protected (Admin role required)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters** (Optional):
  - `role`: Filter by role (passenger, admin)
  - `limit`: Number of results to return
  - `offset`: Number of results to skip
- **Example**: `GET /api/admin/users?role=passenger&limit=20`
- **Success Response** (200):
```json
{
  "status": "success",
  "results": 10,
  "data": {
    "users": [
      {
        "id": 1,
        "email": "user@example.com",
        "name": "John Doe",
        "phone": "+1234567890",
        "role": "passenger",
        "created_at": "2026-01-09T10:00:00.000Z",
        "updated_at": "2026-01-09T10:00:00.000Z"
      }
    ]
  }
}
```

#### 2. Get All Bookings (Admin Only)
- **URL**: `GET /api/admin/bookings`
- **Access**: Protected (Admin role required)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters** (Optional):
  - `status`: Filter by status (confirmed, cancelled, completed)
  - `limit`: Number of results to return
  - `offset`: Number of results to skip
- **Success Response** (200):
```json
{
  "status": "success",
  "results": 25,
  "data": {
    "bookings": [
      {
        "id": 1,
        "booking_reference": "BK1A2B3C4D",
        "user_id": 1,
        "flight_id": 1,
        "passenger_id": 1,
        "seat_number": "12A",
        "booking_class": "economy",
        "status": "confirmed",
        ...
      }
    ]
  }
}
```

#### 3. Get All Passengers (Admin Only)
- **URL**: `GET /api/admin/passengers`
- **Access**: Protected (Admin role required)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters** (Optional):
  - `limit`: Number of results to return
  - `offset`: Number of results to skip
- **Success Response** (200):
```json
{
  "status": "success",
  "results": 15,
  "data": {
    "passengers": [
      {
        "id": 1,
        "user_id": 1,
        "first_name": "John",
        "last_name": "Doe",
        ...
      }
    ]
  }
}
```

#### 4. Get Flight Bookings (Admin Only)
- **URL**: `GET /api/admin/flights/:id/bookings`
- **Access**: Protected (Admin role required)
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200):
```json
{
  "status": "success",
  "results": 5,
  "data": {
    "bookings": [
      {
        "id": 1,
        "booking_reference": "BK1A2B3C4D",
        "user_id": 1,
        "flight_id": 1,
        "passenger_id": 1,
        "seat_number": "12A",
        "booking_class": "economy",
        "status": "confirmed",
        ...
      }
    ]
  }
}
```

#### 5. Delete User (Admin Only)
- **URL**: `DELETE /api/admin/users/:id`
- **Access**: Protected (Admin role required)
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200):
```json
{
  "status": "success",
  "message": "User deleted successfully"
}
```

---

## ⚠️ Error Responses

All endpoints return consistent error responses:

```json
{
  "status": "error",
  "message": "Error message here",
  "statusCode": 400
}
```

Common status codes:
- `400` - Bad Request (validation errors, missing fields)
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

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
