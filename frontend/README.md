# SOS Frontend

Frontend application for the Find Nearby Ambulances and Doctors application. Built with React, TypeScript, TanStack Query, and styled-components with a Notion-inspired design.

## Features

- ✅ Modern React application with TypeScript
- ✅ JWT-based authentication with Role-Based Access Control
- ✅ CRUD operations for ambulances and doctors (Admin only)
- ✅ Pagination (10 records per page)
- ✅ Debounced search with backend filtering
- ✅ Distance filtering (10km, 20km, 50km radius)
- ✅ Location-based filtering using browser geolocation API
- ✅ Reverse geocoding (automatic address lookup)
- ✅ Get current location with auto-fill in forms
- ✅ Loading, error, and empty states
- ✅ Notion-inspired clean and minimal UI design
- ✅ Responsive design with styled-components
- ✅ TanStack Query for data fetching and caching
- ✅ Context API for location and authentication management
- ✅ Comprehensive test coverage with Jest and React Testing Library

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: styled-components (Notion-inspired design)
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend README)

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```bash
VITE_API_URL=http://localhost:3001/api
```

If not provided, the app defaults to `http://localhost:3001/api`.

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start the Vite development server at `http://localhost:3000`. The app will automatically reload when you make changes.

### Production Build

1. Build the application:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

The built files will be in the `dist/` directory.

## Authentication

### Login/Register

- **Login Page** (`/login`): Authenticate with email and password
- **Register Page** (`/register`): Create a new user account (defaults to 'user' role)
- **Protected Routes**: All routes except `/login` and `/register` require authentication
- **Token Storage**: JWT tokens stored in localStorage
- **Auto-redirect**: Unauthenticated users redirected to login

### Role-Based UI

- **Admin Users**: See "Add", "Edit", and "Delete" buttons
- **Regular Users**: Only see the list (read-only access)
- **Role Badge**: Displays user role in header

See [AUTHENTICATION.md](../AUTHENTICATION.md) for detailed authentication documentation.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── ResourceList.tsx    # List component for ambulances/doctors
│   │   ├── ResourceForm.tsx    # Form for creating/editing
│   │   ├── ResourceModal.tsx   # Modal wrapper for form
│   │   └── ErrorBoundary.tsx   # Error boundary component
│   ├── contexts/
│   │   ├── AuthContext.tsx     # Authentication state management
│   │   └── LocationContext.tsx # Location state management
│   ├── lib/
│   │   ├── api.ts              # API client functions
│   │   └── utils.ts            # Utility functions
│   ├── pages/
│   │   ├── Home.tsx            # Main page component
│   │   ├── Login.tsx           # Login page
│   │   └── Register.tsx        # Registration page
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── App.tsx                 # Root component with routing
│   ├── main.tsx                # Application entry point
│   └── setupTests.ts           # Test setup
├── public/                     # Static assets
├── index.html                  # HTML template
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── jest.config.js            # Jest configuration
└── package.json              # Dependencies and scripts
```

## Key Components

### ResourceList

Displays a paginated list of ambulances or doctors with:
- Horizontal card layout (Notion-style)
- Image display (with fallback icons)
- Location and contact information
- Edit and delete actions (Admin only)
- Loading, error, and empty states
- Pagination controls

### ResourceForm

Form component for creating and editing resources with:
- Validation for required fields
- **Get Current Location** button with auto-fill
- Reverse geocoding (automatic address lookup)
- Coordinate input (latitude/longitude)
- Optional fields (image, phone, specialization)
- Error messages

### ResourceModal

Modal wrapper that handles:
- Create and update mutations
- Loading states during API calls
- Form submission
- Query invalidation on success
- Notion-style modal design

### LocationContext

Context provider for managing user location:
- Browser geolocation API integration
- Reverse geocoding (address lookup)
- Loading and error states
- Manual location request function
- Address display in location banner

### AuthContext

Context provider for authentication:
- User state management
- Login/logout functionality
- Token management
- Role checking (isAdmin)
- Protected route handling

## Features in Detail

### Search Functionality

- **Debounced Search**: 500ms delay to reduce API calls while typing
- **Backend Filtering**: Search performed on server for better performance
- **Search Fields**: Searches across title, description, location, phone, and specialization
- **Real-time Results**: Results update automatically after debounce delay
- **Clear Button**: Easy way to clear search query

### Distance Filtering

- **Filter Options**: All, Within 10km, Within 20km, Within 50km
- **Location Required**: Distance filters require user location
- **Smart Disabling**: Filters disabled with helpful tooltips when location unavailable
- **Helper Text**: Guidance to enable location access
- **Combined with Search**: Works together with search functionality

### Location Features

- **Get Current Location**: One-click location detection
- **Reverse Geocoding**: Automatically fetches address from coordinates
- **Location Banner**: Displays current address and coordinates
- **Form Integration**: Auto-fill location in add/edit forms
- **Permission Handling**: Graceful error handling for denied permissions

### Pagination

- Default: 10 records per page
- Navigation buttons (Previous/Next)
- Page indicator (Page X of Y)
- Total count display
- Resets when filters change

### CRUD Operations

- **Create**: Add new ambulance or doctor (Admin only)
- **Read**: View list with pagination, search, and filters
- **Update**: Edit existing records (Admin only)
- **Delete**: Remove records with confirmation (Admin only)

### State Management

- **TanStack Query**: Server state (API data, caching, refetching)
- **Context API**: 
  - Location state (user coordinates, address)
  - Authentication state (user, token, role)
- **Local State**: UI state (modals, forms, pagination, search, filters)

## UI Design

### Notion-Inspired Design

The application features a clean, minimal design inspired by Notion:

- **Colors**: 
  - Primary: #37352f (dark gray)
  - Secondary: rgba(55, 53, 47, 0.65) (muted gray)
  - Background: #ffffff (white)
  - Borders: rgba(55, 53, 47, 0.09) (subtle borders)
- **Typography**: System font stack (ui-sans-serif)
- **Shadows**: Subtle, layered shadows for depth
- **Borders**: 1px solid with low opacity
- **Transitions**: Smooth 0.15s ease transitions
- **Scrollbars**: Custom styled scrollbars

### Components

- **Buttons**: Multiple variants (primary, secondary, ghost, outline, danger)
- **Inputs**: Clean borders with focus states
- **Cards**: Subtle shadows with hover effects
- **Modals**: Slide-up animation with overlay
- **Tabs**: Underline indicator for active tab

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
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

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires geolocation API support for location features
- No legacy browser support required

## Environment Variables

- `VITE_API_URL`: Backend API base URL (default: `http://localhost:3001/api`)

## API Integration

The frontend communicates with the backend through the API client in `src/lib/api.ts`. All API calls use:
- Axios for HTTP requests
- Automatic JWT token injection from localStorage
- TanStack Query for caching and state management
- TypeScript types for type safety
- Request/response interceptors for error handling

## Error Handling

- Network errors are caught and displayed to users
- Form validation errors are shown inline
- Loading states prevent duplicate submissions
- Empty states guide users when no data is available
- Error boundary catches React errors

## Performance

- React Query caching reduces unnecessary API calls
- Debounced search reduces API requests
- Code splitting via Vite
- Optimized re-renders with React hooks
- Backend filtering reduces data transfer

## Future Enhancements

Potential improvements:
- Map view integration (Google Maps, Mapbox)
- Real-time distance calculation display
- Image upload instead of URL input
- Favorites/bookmarks
- Offline support with service workers
- Progressive Web App (PWA) features
- Advanced filtering options
- Export functionality
