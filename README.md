# SOS - Find Nearby Ambulances and Doctors

A full-stack application to help users find nearby ambulance services and doctors based on their location. Built with modern technologies and featuring JWT-based authentication with Role-Based Access Control (RBAC).

## 🚀 Features

### Core Features
- **CRUD Operations**: Add, edit, update, and delete ambulances and doctors (Admin only)
- **Role-Based Access Control**: Admin users can manage resources, regular users can view
- **Location-Based Search**: Find nearby services using geolocation with distance filtering
- **Search Functionality**: Debounced search across titles, descriptions, locations, and phone numbers
- **Distance Filters**: Filter by radius (10km, 20km, 50km) from your location
- **Pagination**: View 10 records per page with navigation
- **Real-time Counts**: See total number of ambulances and doctors
- **Rich Display**: View title, description, location, images, and contact information
- **State Management**: Loading, error, and empty states
- **Modern UI**: Notion-inspired clean and minimal design

### Location Features
- **Get Current Location**: One-click location detection with browser geolocation
- **Reverse Geocoding**: Automatically fetch and display address from coordinates
- **Location Banner**: Shows your current address and coordinates
- **Auto-fill Forms**: Get current location button in add/edit forms automatically fills coordinates and address

### Authentication Features
- **JWT Authentication**: Secure token-based authentication
- **User Registration**: Public registration with default 'user' role
- **Admin Management**: Admin users created via script (cannot self-register)
- **Protected Routes**: Frontend routes require authentication
- **Role-Based UI**: Different UI elements based on user role

## 📁 Project Structure

```
sos/
├── backend/          # Node.js + Express + TypeScript + SQLite
├── frontend/         # React + TypeScript + TanStack Query
├── README.md         # This file
└── AUTHENTICATION.md # Authentication & Authorization guide
```

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript
- SQLite (better-sqlite3)
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- Jest (Testing)
- ESLint

### Frontend
- React 18
- TypeScript
- Vite
- TanStack Query (React Query)
- styled-components
- React Router DOM
- Axios
- Jest + React Testing Library
- ESLint

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

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

4. Seed the database with sample data:
```bash
# Seed ambulances and doctors (50 entries)
npm run seed

# Create an admin user
npm run create-admin admin@example.com yourpassword123
```

5. Start the development server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3001`

See [backend/README.md](./backend/README.md) for detailed backend documentation.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file:
```bash
VITE_API_URL=http://localhost:3001/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend application will be available at `http://localhost:3000`

See [frontend/README.md](./frontend/README.md) for detailed frontend documentation.

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (requires authentication)

### Ambulances
- `GET /api/ambulances` - Get all ambulances (with pagination, search, and location filter)
  - Query params: `page`, `limit`, `latitude`, `longitude`, `radius`, `search`
- `GET /api/ambulances/:id` - Get ambulance by ID
- `POST /api/ambulances` - Create new ambulance (Admin only)
- `PUT /api/ambulances/:id` - Update ambulance (Admin only)
- `DELETE /api/ambulances/:id` - Delete ambulance (Admin only)

### Doctors
- `GET /api/doctors` - Get all doctors (with pagination, search, and location filter)
  - Query params: `page`, `limit`, `latitude`, `longitude`, `radius`, `search`
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create new doctor (Admin only)
- `PUT /api/doctors/:id` - Update doctor (Admin only)
- `DELETE /api/doctors/:id` - Delete doctor (Admin only)

## 🗄️ Database Seeding

### Seed Sample Data

The backend includes a seeding script that populates the database with 50 entries (25 ambulances and 25 doctors) around Amroli, Gujarat, India:

```bash
cd backend
npm run seed
```

This will:
- Clear existing data
- Insert 25 ambulances with realistic names and descriptions
- Insert 25 doctors with various specializations
- Distribute entries at different distances (near and far from center point)
- Use placeholder images from placehold.co

### Create Admin User

Admin users cannot self-register. Create an admin user using:

```bash
cd backend
npm run create-admin admin@example.com yourpassword123
```

## 🔐 Authentication

The application uses JWT-based authentication with Role-Based Access Control (RBAC):

- **Admin Role**: Full CRUD access to ambulances and doctors
- **User Role**: Read-only access (can view lists)

See [AUTHENTICATION.md](./AUTHENTICATION.md) for detailed authentication documentation.

## 🎨 UI Features

### Notion-Inspired Design
- Clean, minimal interface
- Subtle shadows and borders
- Smooth transitions and hover effects
- Consistent typography and spacing
- Custom scrollbar styling

### Search & Filter
- **Debounced Search**: 500ms delay to reduce API calls
- **Backend Filtering**: Search performed on server for better performance
- **Distance Filters**: Filter by 10km, 20km, or 50km radius
- **Combined Filters**: Search and distance filters work together
- **Clear Filters**: One-click to reset all filters

### Location Features
- **Get Current Location**: Browser geolocation with permission handling
- **Reverse Geocoding**: Automatic address lookup from coordinates
- **Location Banner**: Displays current address and coordinates
- **Form Integration**: Auto-fill location in add/edit forms

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 Requirements Checklist

- ✅ Add, edit, update, and delete ambulances and doctors
- ✅ List view with pagination (10 per page)
- ✅ Total count display
- ✅ Display: Title, Description, Location, Image
- ✅ Loading state
- ✅ Error state
- ✅ Empty state
- ✅ Separate frontend and backend
- ✅ SQLite database
- ✅ Context APIs for state management
- ✅ Geolocation APIs
- ✅ React Query / TanStack Query
- ✅ TypeScript (both frontend and backend)
- ✅ Jest tests
- ✅ Code linting
- ✅ Functional components
- ✅ CSS-in-JS (styled-components)
- ✅ Detailed README files
- ✅ JWT Authentication
- ✅ Role-Based Access Control
- ✅ Search functionality
- ✅ Distance filtering
- ✅ Reverse geocoding

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs (10 salt rounds)
- Role-based authorization on protected routes
- CORS enabled for development
- Input validation on both frontend and backend
- SQL injection protection via parameterized queries
- XSS protection via React's built-in escaping

## 📄 License

This project is created for a coding challenge.

## 👤 Author

Created as part of a coding challenge.

---

For detailed documentation, see:
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Authentication Guide](./AUTHENTICATION.md)
