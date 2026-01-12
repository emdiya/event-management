# Authentication Guide

## Login as Admin

### Default Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

### Login Endpoint

**POST** `/api/auth/login`

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin",
  "roles": ["ADMIN"]
}
```

### Using the Token

Include the JWT token in the Authorization header for protected endpoints:

```
Authorization: Bearer <your-token-here>
```

## API Endpoints

### Public Endpoints (No Authentication)
- `POST /api/auth/login` - Login
- `POST /api/events` - Create event
- `GET /api/events/{code}` - Get event by code
- `POST /api/registrations` - Register attendee

### Protected Endpoints (Requires Authentication)
- `POST /api/checkin` - Check-in attendee (any authenticated user)

### Admin Endpoints (Requires ADMIN role)
- `GET /api/admin/events` - List all events
- `PUT /api/admin/events/{eventId}/status` - Update event status
- `DELETE /api/admin/events/{eventId}` - Delete event
- `GET /api/admin/events/{eventId}/stats` - Get event statistics

## Example: Login and Access Admin Endpoint

### 1. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### 2. Use Token for Admin Endpoint
```bash
curl -X GET http://localhost:8080/api/admin/events \
  -H "Authorization: Bearer <your-token-here>"
```

## Security Features

- ✅ JWT-based authentication
- ✅ Stateless session management
- ✅ BCrypt password encryption
- ✅ Role-based access control (RBAC)
- ✅ Token expiration (24 hours default)
- ✅ Method-level security with `@PreAuthorize`

## Creating Additional Users

Users are created in the database. Default admin user is created at startup with:
- Username: `admin`
- Password: `admin123` (BCrypt encrypted)
- Role: `ADMIN`

Additional roles available: `STAFF`
