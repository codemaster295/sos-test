# Authentication & Authorization Guide

## Overview

The SOS application implements industry-standard JWT-based authentication with Role-Based Access Control (RBAC). The system supports two roles:

- **Admin**: Can create, read, update, and delete ambulances and doctors
- **User**: Can only view the list of ambulances and doctors

## Backend Authentication

### Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Set environment variables in `.env`:
```
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3001
DB_PATH=./data/database.sqlite
```

3. Create an admin user:
```bash
npm run create-admin admin@example.com admin123
```

**Note**: Admin users cannot self-register. They must be created using the script for security reasons.

### API Endpoints

#### Authentication Routes (`/api/auth`)

- **POST `/api/auth/register`** - Register a new user (creates 'user' role by default)
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe" // optional
  }
  ```
  Response:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 2,
      "email": "user@example.com",
      "role": "user",
      "name": "John Doe"
    }
  }
  ```

- **POST `/api/auth/login`** - Login and get JWT token
  ```json
  {
    "email": "admin@example.com",
    "password": "admin123"
  }
  ```
  Response:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "role": "admin",
      "name": "Admin User"
    }
  }
  ```

- **GET `/api/auth/me`** - Get current user (requires authentication)
  Headers: `Authorization: Bearer <token>`
  Response:
  ```json
  {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin",
    "name": "Admin User"
  }
  ```

#### Protected Routes

**Ambulances:**
- `GET /api/ambulances` - Public (all authenticated users can view)
- `POST /api/ambulances` - Admin only
- `PUT /api/ambulances/:id` - Admin only
- `DELETE /api/ambulances/:id` - Admin only

**Doctors:**
- `GET /api/doctors` - Public (all authenticated users can view)
- `POST /api/doctors` - Admin only
- `PUT /api/doctors/:id` - Admin only
- `DELETE /api/doctors/:id` - Admin only

### Middleware

- `authenticate` - Verifies JWT token and attaches user to request
  - Checks for `Authorization: Bearer <token>` header
  - Verifies token signature and expiration
  - Fetches user from database
  - Attaches user object to `req.user`

- `authorize(...roles)` - Checks if user has required role(s)
  - Must be used after `authenticate` middleware
  - Checks if `req.user.role` is in the allowed roles array
  - Returns 403 Forbidden if user doesn't have required role

### Usage Example

```typescript
// Public route
router.get('/ambulances', (req, res) => {
  // Anyone can access
});

// Admin only route
router.post('/ambulances', authenticate, authorize('admin'), (req, res) => {
  // Only admins can access
  // req.user is available with user info
});
```

## Frontend Authentication

### Features

- Login/Register pages with Notion-inspired design
- Protected routes (redirects to login if not authenticated)
- Role-based UI visibility (admin-only buttons/actions)
- JWT token stored in localStorage
- Automatic token injection in API requests via Axios interceptors
- User info display with role badge
- Logout functionality

### Usage

1. **Login Flow:**
   - User visits `/login`
   - Enters email and password
   - Token is stored in localStorage
   - User is redirected to home page
   - Token is automatically included in all API requests

2. **Registration Flow:**
   - User visits `/register`
   - Creates account (defaults to 'user' role)
   - Automatically logged in after registration
   - Token stored and user redirected to home

3. **Protected Routes:**
   - All routes except `/login` and `/register` require authentication
   - Unauthenticated users are redirected to `/login`
   - Loading state shown while checking authentication

4. **Role-Based UI:**
   - Admin users see "Add" buttons for creating resources
   - Admin users see "Edit" and "Delete" buttons on resource cards
   - Regular users only see the list (read-only access)
   - Role badge displayed in header (Admin/User)

### Context API

The `AuthContext` provides:

```typescript
interface AuthContextType {
  user: User | null;              // Current user object
  token: string | null;           // JWT token
  loading: boolean;               // Authentication loading state
  login: (credentials) => Promise<void>;    // Login function
  register: (userData) => Promise<void>;    // Register function
  logout: () => void;             // Logout function
  isAdmin: boolean;               // Boolean indicating admin role
}
```

### Usage in Components

```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAdmin, logout } = useAuth();
  
  return (
    <div>
      {isAdmin && <button>Add Resource</button>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Security Features

1. **Password Hashing**: Uses bcryptjs with 10 salt rounds
   - Passwords are never stored in plain text
   - Hashing is asynchronous for better security

2. **JWT Tokens**: Secure token-based authentication
   - Tokens signed with secret key
   - Configurable expiration (default: 7 days)
   - Token payload includes: userId, email, role

3. **Token Expiration**: Configurable expiration (default: 7 days)
   - Expired tokens are rejected
   - Users must re-login after expiration

4. **Role Validation**: Server-side role checking on protected routes
   - Client-side UI is for UX only
   - All authorization checks happen on the server

5. **Input Validation**: Email and password validation
   - Email format validation
   - Password required
   - Error messages without exposing sensitive info

6. **Error Handling**: Proper error messages without exposing sensitive info
   - Generic error messages for security
   - Detailed errors logged server-side only

## Creating Admin Users

Admin users cannot self-register. They must be created using the script:

```bash
cd backend
npm run create-admin admin@example.com securepassword123
```

This script will:
1. Check if user already exists
2. Hash the password using bcryptjs
3. Create user with role='admin'
4. Display success message

**Security Note**: Admin role cannot be assigned during registration. This prevents privilege escalation attacks.

## Database Seeding

### Seed Sample Data

Populate the database with 50 sample entries (25 ambulances and 25 doctors):

```bash
cd backend
npm run seed
```

This will:
- Clear existing data
- Insert 25 ambulances with realistic names and descriptions
- Insert 25 doctors with various specializations
- Distribute entries at different distances from Amroli, Gujarat, India
- Use placeholder images from placehold.co

### Complete Setup Example

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Seed sample data
npm run seed

# 3. Create admin user
npm run create-admin admin@example.com admin123

# 4. Start server
npm run dev
```

## Testing

### Test Admin Login:

1. Create admin: `npm run create-admin admin@test.com admin123`
2. Login at `/api/auth/login` with credentials
3. Use token in `Authorization: Bearer <token>` header for protected routes

### Test User Registration:

1. Register at `/api/auth/register` or use frontend
2. Login with registered credentials
3. Verify user can only view (no edit/delete buttons in UI)
4. Verify user cannot access POST/PUT/DELETE endpoints (403 Forbidden)

### Test Protected Routes:

```bash
# Without token (should return 401)
curl http://localhost:3001/api/ambulances

# With token (should return 200)
curl -H "Authorization: Bearer <token>" http://localhost:3001/api/ambulances

# Admin creating resource (should return 201)
curl -X POST -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test","location":"Test","latitude":0,"longitude":0}' \
  http://localhost:3001/api/ambulances

# User trying to create (should return 403)
curl -X POST -H "Authorization: Bearer <user-token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test","location":"Test","latitude":0,"longitude":0}' \
  http://localhost:3001/api/ambulances
```

## Token Management

### Token Storage

- **Frontend**: Tokens stored in `localStorage`
- **Backend**: Tokens are stateless (no server-side storage)
- **Expiration**: Handled by JWT library

### Token Refresh

Currently, tokens expire after the configured time (default: 7 days). Users must re-login after expiration. For production, consider implementing:
- Refresh tokens
- Token rotation
- HttpOnly cookies instead of localStorage

## Security Best Practices

1. **JWT_SECRET**: Use a strong, random string in production
   - Generate using: `openssl rand -base64 32`
   - Never commit secrets to version control

2. **Password Requirements**: Consider adding:
   - Minimum length (8+ characters)
   - Complexity requirements
   - Password strength meter

3. **Rate Limiting**: Consider adding rate limiting for:
   - Login attempts
   - Registration attempts
   - API requests

4. **HTTPS**: Always use HTTPS in production
   - Protects tokens in transit
   - Prevents man-in-the-middle attacks

5. **Token Storage**: Consider httpOnly cookies for production
   - More secure than localStorage
   - Prevents XSS attacks from accessing tokens

## Notes

- Tokens are stored in localStorage (consider httpOnly cookies for production)
- JWT_SECRET should be a strong random string in production
- Admin role cannot be assigned during registration (security measure)
- All CRUD operations require authentication
- Only admins can perform write operations
- GET operations are public for authenticated users
- Token expiration is handled automatically by JWT library
- Passwords are hashed using bcryptjs with 10 salt rounds

## Troubleshooting

### "No token provided" error
- Check if token is being sent in `Authorization: Bearer <token>` header
- Verify token is stored in localStorage
- Check Axios interceptors are configured correctly

### "Invalid or expired token" error
- Token may have expired (default: 7 days)
- Token may be malformed
- JWT_SECRET may have changed
- Solution: Re-login to get a new token

### "Forbidden: Insufficient permissions" error
- User doesn't have required role (admin)
- Check user role in database
- Verify `authorize('admin')` middleware is used correctly

### Admin user not working
- Verify user was created with `npm run create-admin`
- Check database for user role='admin'
- Verify password is correct
- Check JWT token contains correct role
