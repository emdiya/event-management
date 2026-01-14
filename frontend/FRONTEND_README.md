# Frontend - Event Management System

Next.js frontend application for the Event Management System with full backend API integration.

## 🚀 Features

### Public Features
- **Browse Events** - View all published events with pagination
- **Event Details** - See detailed information about each event
- **Event Registration** - Register for events with Telegram integration
- **Responsive Design** - Mobile-friendly UI with dark mode support

### Admin Features
- **Dashboard** - Overview of all events and statistics
- **Event Management** - Create, update, and delete events
- **Attendee Management** - View registrations and check-in status
- **QR Code Check-in** - Scan attendee tickets for check-in

## 📋 Prerequisites

- Node.js 18+ or 20+
- npm, yarn, or pnpm
- Backend API running (default: http://localhost:8080)

## 🛠️ Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
# or
yarn install
# or
pnpm install
```

### 2. Configure Environment Variables

Create `.env.local` file:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080

# Optional: For production
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 3. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The frontend will be available at http://localhost:3000

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Home page
│   ├── events/
│   │   └── [id]/page.tsx       # Event details page
│   ├── admin/
│   │   ├── login/page.tsx       # Admin login
│   │   ├── dashboard/page.tsx   # Admin dashboard
│   │   └── events/              # Event management
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── event-card.tsx           # Event card component
│   ├── events-grid.tsx          # Events grid with pagination
│   ├── registration-modal.tsx   # Registration form modal
│   ├── hero-section.tsx         # Landing page hero
│   └── ui/                      # shadcn/ui components
├── lib/                         # Utilities and configurations
│   ├── api.ts                   # ⭐ Backend API service layer
│   ├── axios.ts                 # Axios configuration
│   ├── types.ts                 # TypeScript types
│   ├── redux/                   # Redux store and slices
│   │   ├── store.ts
│   │   └── slices/
│   │       ├── eventsSlice.ts
│   │       └── registrationSlice.ts
│   └── utils.ts                 # Utility functions
└── public/                      # Static assets
```

## 🔌 API Integration

The frontend uses a centralized API service layer (`lib/api.ts`) to communicate with the backend.

### API Service Functions

```typescript
import api from '@/lib/api'

// Get all events (with pagination and filters)
const events = await api.events.getAll({
  page: 0,
  size: 12,
  status: 'PUBLISHED',
  title: 'search query'
})

// Get single event
const event = await api.events.getByHashId('abc123')

// Register for event
const ticket = await api.registration.register({
  eventCode: 'EVENT123',
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  telegramUserId: 123456789
})

// Admin login
const auth = await api.admin.login({
  email: 'admin@example.com',
  password: 'password'
})
```

### Backend API Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/events` | GET | List all events (public) |
| `/api/events/:hashId` | GET | Get event details (public) |
| `/api/events` | POST | Create event (ADMIN/STAFF) |
| `/api/registrations` | POST | Register for event |
| `/api/auth/login` | POST | Admin login |
| `/api/admin/events` | GET | Admin event list |
| `/api/admin/events/:id/status` | PUT | Update event status |
| `/api/admin/events/:id` | DELETE | Delete event |
| `/api/check-in` | POST | Check-in attendee |

## 🎨 Components

### EventCard
Displays individual event with:
- Title, description, location
- Date and time
- Status badge (DRAFT/PUBLISHED/CLOSED)
- Register button

```tsx
import EventCard from '@/components/event-card'
import type { EventResponse } from '@/lib/api'

<EventCard event={eventData} />
```

### EventsGrid
Grid layout with:
- Loading states
- Error handling
- Pagination support
- Redux state management

```tsx
import { EventsGrid } from '@/components/events-grid'

<EventsGrid />
```

### RegistrationModal
Registration form with:
- Event details display
- Form validation
- Success/error states
- Telegram user ID support

```tsx
import { RegistrationModal } from '@/components/registration-modal'

<RegistrationModal 
  event={event}
  open={isOpen}
  onOpenChange={setIsOpen}
/>
```

## 🔄 Redux Store

### Events Slice

```typescript
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { fetchEvents } from '@/lib/redux/slices/eventsSlice'

const dispatch = useAppDispatch()
const { items, loading, error, pagination } = useAppSelector(state => state.events)

// Fetch events with filters
dispatch(fetchEvents({ 
  page: 0, 
  size: 12, 
  status: 'PUBLISHED' 
}))
```

### Registration Slice

```typescript
import { submitRegistration } from '@/lib/redux/slices/registrationSlice'

const { loading, error, success, ticket } = useAppSelector(state => state.registration)

dispatch(submitRegistration({
  eventCode: 'EVENT123',
  fullName: 'John Doe',
  // ...
}))
```

## 🎯 Key Features Implementation

### 1. Event Listing with Pagination

The events grid automatically fetches from backend API:

```typescript
// components/events-grid.tsx
useEffect(() => {
  dispatch(fetchEvents({ page: 0, size: 12 }))
}, [])
```

Backend response:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 0,
    "pageSize": 12,
    "totalItems": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

### 2. Event Registration

Registration flow:
1. User clicks "Register" on event card
2. Modal opens with event details
3. User fills form (name, email, phone, company, Telegram ID)
4. Form submits to `/api/registrations`
5. Backend creates attendee + ticket
6. Success: Shows ticket number
7. Telegram notification sent (if Telegram ID provided)

### 3. Error Handling

All API calls include comprehensive error handling:

```typescript
try {
  const response = await api.events.getAll()
  // Success
} catch (error) {
  // Error displayed in UI
  console.error('API Error:', error)
}
```

## 🔒 Authentication

Admin routes require JWT token:

```typescript
// Stored in localStorage after login
localStorage.setItem('authToken', token)

// Automatically attached to requests
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Environment Variables (Production)

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Deploy to Vercel

```bash
vercel --prod
```

Configure environment variables in Vercel dashboard.

### Deploy to Other Platforms

The frontend is a standard Next.js app and can be deployed to:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Docker container

## 🧪 Testing API Integration

### Test Events Listing

1. Start backend: `cd backend && ./mvnw spring-boot:run`
2. Start frontend: `cd frontend && npm run dev`
3. Visit http://localhost:3000
4. Check browser console for API logs
5. Verify events display correctly

### Test Registration

1. Click "Register" on any published event
2. Fill in the form
3. Submit registration
4. Check:
   - Success message with ticket number
   - Backend logs for registration
   - Database for new attendee record
   - Telegram for notification (if ID provided)

## 📝 Type Safety

All API responses are fully typed:

```typescript
import type { 
  EventResponse, 
  TicketIssuedResponse,
  PaginationResponse,
  ApiResponse 
} from '@/lib/api'

// TypeScript ensures type safety
const event: EventResponse = await api.events.getByHashId('abc')
```

## 🐛 Troubleshooting

### Events Not Loading

**Check:**
1. Backend is running on correct port
2. CORS is configured in backend
3. `.env.local` has correct API URL
4. Browser console for error messages

**Solution:**
```typescript
// Update lib/axios.ts if needed
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
```

### Registration Fails

**Check:**
1. Event code is correct
2. Event status is PUBLISHED
3. All required fields are filled
4. Backend logs for error details

### 401 Unauthorized (Admin Routes)

**Check:**
1. User is logged in
2. Token is in localStorage
3. Token is not expired
4. User has correct role (ADMIN/STAFF)

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Backend API Documentation](../backend/README.md)
- [Telegram Integration Guide](../TELEGRAM_INTEGRATION.md)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test API integration
4. Submit pull request

## 📄 License

This project is licensed under the MIT License.
