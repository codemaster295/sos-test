# SOS Backend API

Backend API for the Find Nearby Ambulances and Doctors application. Built with Node.js, Express, TypeScript, and SQLite.

## Features

- ✅ RESTful API for ambulances and doctors
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ JWT-based authentication with Role-Based Access Control (RBAC)
- ✅ Pagination support (10 records per page by default)
- ✅ Location-based filtering with radius search
- ✅ Search functionality (backend filtering)
- ✅ SQLite database with automatic schema creation
- ✅ TypeScript for type safety
- ✅ Comprehensive test coverage with Jest
- ✅ ESLint for code quality

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Testing**: Jest
- **Linting**: ESLint

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
PORT=3001
NODE_ENV=development
DB_PATH=./data/database.sqlite
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start the server with hot-reload using `tsx watch`. The server will be available at `http://localhost:3001`.

### Production Mode

1. Build the TypeScript code:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

## Database Seeding

### Seed Sample Data

Populate the database with 50 sample entries (25 ambulances and 25 doctors) around Amroli, Gujarat, India:

```bash
npm run seed
```

This script will:
- Clear existing data
- Insert 25 ambulances with realistic names, descriptions, and locations
- Insert 25 doctors with various specializations
- Distribute entries at different distances (near and far from center point)
- Use placeholder images from placehold.co

### Create Admin User

Admin users cannot self-register. Create an admin user using:

```bash
npm run create-admin admin@example.com yourpassword123
```

This will:
- Hash the password using bcryptjs
- Create a user with 'admin' role
- Display success message

**Note**: Admin role cannot be assigned during registration for security reasons.

## API Endpoints

### Health Check

- **GET** `/health`
  - Returns server status

### Authentication (`/api/auth`)

- **POST** `/api/auth/register`
  - Register a new user (defaults to 'user' role)
  - Body:
    ```json
    {
      "email": "user@example.com",
      "password": "password123",
      "name": "John Doe"
    }
    ```
  - Response: `{ token, user }`

- **POST** `/api/auth/login`
  - Login and get JWT token
  - Body:
    ```json
    {
      "email": "admin@example.com",
      "password": "admin123"
    }
    ```
  - Response: `{ token, user }`

- **GET** `/api/auth/me`
  - Get current user (requires authentication)
  - Headers: `Authorization: Bearer <token>`
  - Response: User object (without password)

### Ambulances (`/api/ambulances`)

- **GET** `/api/ambulances`
  - Get all ambulances with pagination, search, and location filtering
  - **Public** (all authenticated users can view)
  - Query parameters:
    - `page` (optional, default: 1): Page number
    - `limit` (optional, default: 10): Records per page
    - `latitude` (optional): Filter by location latitude
    - `longitude` (optional): Filter by location longitude
    - `radius` (optional, default: 50): Search radius in kilometers
    - `search` (optional): Search term (searches title, description, location, phone)
  - Response:
    ```json
    {
      "data": [...],
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
    ```

- **GET** `/api/ambulances/:id`
  - Get ambulance by ID
  - **Public**

- **POST** `/api/ambulances`
  - Create a new ambulance
  - **Admin only** (requires authentication and admin role)
  - Body:
    ```json
    {
      "title": "Emergency Ambulance Service",
      "description": "24/7 emergency ambulance service",
      "location": "123 Main St, City",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "image": "https://example.com/image.jpg",
      "phone": "123-456-7890"
    }
    ```

- **PUT** `/api/ambulances/:id`
  - Update an existing ambulance
  - **Admin only**
  - Body: Partial ambulance object

- **DELETE** `/api/ambulances/:id`
  - Delete an ambulance
  - **Admin only**

### Doctors (`/api/doctors`)

- **GET** `/api/doctors`
  - Get all doctors with pagination, search, and location filtering
  - **Public** (all authenticated users can view)
  - Query parameters: Same as ambulances
  - Response: Same format as ambulances

- **GET** `/api/doctors/:id`
  - Get doctor by ID
  - **Public**

- **POST** `/api/doctors`
  - Create a new doctor
  - **Admin only**
  - Body:
    ```json
    {
      "title": "Dr. John Doe",
      "description": "Experienced cardiologist",
      "location": "456 Medical Center, City",
      "latitude": 40.7580,
      "longitude": -73.9855,
      "image": "https://example.com/doctor.jpg",
      "phone": "987-654-3210",
      "specialization": "Cardiology"
    }
    ```

- **PUT** `/api/doctors/:id`
  - Update an existing doctor
  - **Admin only**
  - Body: Partial doctor object

- **DELETE** `/api/doctors/:id`
  - Delete a doctor
  - **Admin only**

## Database Schema

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| email | TEXT | Unique email address |
| password | TEXT | Hashed password (bcryptjs) |
| role | TEXT | User role ('admin' or 'user') |
| name | TEXT | User's name (optional) |
| createdAt | DATETIME | Creation timestamp |
| updatedAt | DATETIME | Last update timestamp |

### Ambulances Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| title | TEXT | Ambulance service name |
| description | TEXT | Description of the service |
| location | TEXT | Address/location string |
| latitude | REAL | Latitude coordinate |
| longitude | REAL | Longitude coordinate |
| image | TEXT | Image URL (optional) |
| phone | TEXT | Contact phone number (optional) |
| createdAt | DATETIME | Creation timestamp |
| updatedAt | DATETIME | Last update timestamp |

### Doctors Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| title | TEXT | Doctor name |
| description | TEXT | Description |
| location | TEXT | Address/location string |
| latitude | REAL | Latitude coordinate |
| longitude | REAL | Longitude coordinate |
| image | TEXT | Image URL (optional) |
| phone | TEXT | Contact phone number (optional) |
| specialization | TEXT | Medical specialization (optional) |
| createdAt | DATETIME | Creation timestamp |
| updatedAt | DATETIME | Last update timestamp |

## Authentication & Authorization

### Middleware

- `authenticate` - Verifies JWT token and attaches user to request
- `authorize(...roles)` - Checks if user has required role(s)

### Protected Routes

**Ambulances:**
- `GET /api/ambulances` - Public (all authenticated users)
- `POST /api/ambulances` - Admin only
- `PUT /api/ambulances/:id` - Admin only
- `DELETE /api/ambulances/:id` - Admin only

**Doctors:**
- `GET /api/doctors` - Public (all authenticated users)
- `POST /api/doctors` - Admin only
- `PUT /api/doctors/:id` - Admin only
- `DELETE /api/doctors/:id` - Admin only

See [AUTHENTICATION.md](../AUTHENTICATION.md) for detailed authentication documentation.

## Search Functionality

The API supports backend search filtering using SQL LIKE queries:

- **Search Fields**:
  - Ambulances: `title`, `description`, `location`, `phone`
  - Doctors: `title`, `description`, `location`, `phone`, `specialization`
- **Search Parameter**: `?search=query`
- **Case Insensitive**: Uses SQL LIKE with wildcards
- **Combined with Filters**: Works with pagination and location filters

Example:
```
GET /api/ambulances?search=emergency&page=1&limit=10
```

## Location-Based Search

The API supports location-based filtering using the Haversine formula to calculate distances between coordinates. When `latitude` and `longitude` query parameters are provided:

1. All records are fetched from the database (with search filter if provided)
2. Distance from the provided coordinates is calculated for each record
3. Records within the specified `radius` (default: 50km) are filtered
4. Results are sorted by distance (nearest first)

Example:
```
GET /api/ambulances?latitude=21.241956&longitude=72.876412&radius=10
```

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Linting

Check code quality:
```bash
npm run lint
```

Fix linting issues automatically:
```bash
npm run lint:fix
```

## Project Structure

```
backend/
├── src/
│   ├── database/
│   │   └── database.ts          # Database initialization
│   ├── middleware/
│   │   └── auth.ts              # Authentication & authorization middleware
│   ├── routes/
│   │   ├── ambulanceRoutes.ts   # Ambulance API routes
│   │   ├── doctorRoutes.ts      # Doctor API routes
│   │   └── authRoutes.ts        # Authentication routes
│   ├── services/
│   │   ├── ambulanceService.ts  # Ambulance business logic
│   │   ├── doctorService.ts     # Doctor business logic
│   │   └── userService.ts       # User business logic
│   ├── scripts/
│   │   ├── createAdmin.ts       # Admin user creation script
│   │   └── seedData.ts          # Database seeding script
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── utils/
│   │   ├── distance.ts          # Distance calculation utilities
│   │   ├── jwt.ts               # JWT token utilities
│   │   └── password.ts          # Password hashing utilities
│   └── index.ts                 # Application entry point
├── data/                        # SQLite database files (gitignored)
├── dist/                        # Compiled JavaScript (gitignored)
├── .env.example                 # Environment variables example
├── .eslintrc.json              # ESLint configuration
├── jest.config.js              # Jest configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `204` - No Content (successful delete)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `500` - Internal Server Error

Error responses follow this format:
```json
{
  "error": "Error message"
}
```

## CORS

CORS is enabled for all origins. In production, you may want to restrict this to specific domains.

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `DB_PATH` - Path to SQLite database file
- `JWT_SECRET` - Secret key for JWT token signing
- `JWT_EXPIRES_IN` - Token expiration time (default: 7d)

## Notes

- The database file is created automatically on first run in the `data/` directory
- All timestamps are stored in UTC
- Location-based search calculates distances in kilometers
- The API uses in-memory filtering for location-based queries. For production with large datasets, consider using PostGIS or a dedicated geospatial database
- Search is performed at the database level using SQL LIKE queries for better performance
- Admin users must be created via script - they cannot self-register

## Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Check code quality
- `npm run create-admin` - Create admin user
- `npm run seed` - Seed database with sample data
