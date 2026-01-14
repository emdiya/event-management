# Telegram Bot & Web App Integration Architecture

## Complete Flow Diagram

```
┌─────────────┐
│   User      │
│  (Telegram) │
└──────┬──────┘
       │
       │ /start or /register
       ▼
┌───────────────────────────────┐
│  Telegram Bot (Backend)       │  (Spring Boot - TelegramWebhookController)
│ - /start                      │
│ - /register <EVENT_CODE>      │
│ - /events                     │
└────────┬──────────────────────┘
         │
         │ Opens Web App Button
         ▼
┌──────────────────────────────────┐
│   Telegram Web App               │  (Next.js /telegram/register)         │
│                                  │
│ 1. Loads Telegram WebApp SDK     │
│ 2. Auto-fills user info          │
│ 3. Shows RegistrationModal       │
│ 4. Submits form                  │
└────────┬─────────────────────────┘
         │
         │ POST /api/registrations
         │ {
         │   eventCode: "ABC123",
         │   telegramUserId: 123456789,
         │   fullName: "John Doe",
         │   ...
         │ }
         ▼
┌──────────────────────────────────┐
│  Spring Boot Backend             │  (Java)
│                                  │
│ RegistrationController           │
│   │                              │
│   ├─> RegistrationService        │
│   │    │                         │
│   │    ├─> Find Event            │
│   │    ├─> Create Attendee       │
│   │    ├─> Generate Ticket       │
│   │    └─> Send Telegram         │
│   │         Notification         │
│   │                              │
│   └─> TelegramBotClient          │
│        sendMessageToUser()       │
└────────┬─────────────────────────┘
         │
         │ POST https://api.telegram.org/bot{token}/sendMessage
         │ {
         │   chat_id: 123456789,
         │   text: "✅ Registration Confirmed!\n🎫 T-ABC123",
         │   parse_mode: "HTML"
         │ }
         ▼
┌─────────────────┐
│  Telegram API   │
└────────┬────────┘
         │
         │ Delivers message
         ▼
┌─────────────┐
│   User      │  ← Receives confirmation
│  (Telegram) │     with ticket details
└─────────────┘
```

## Component Details

### 1. Telegram Bot (Backend)
**Location:** `backend/src/main/java/com/kd/eventmanagement/backend/controller/TelegramWebhookController.java`
**Purpose:** Entry point for Telegram updates
**Features:**
- Command handlers (/start, /events, /register <EVENT_CODE>)
- Web App button generation pointing to `/telegram/register?code=...`
- Uses `TelegramBotClient` for sending messages

### 2. Web App (Next.js)
**Location:** `frontend/app/telegram/register/page.tsx`
**Purpose:** Registration form interface
**Features:**
- Telegram WebApp SDK integration
- Auto-fill user data from Telegram
- Form validation
- API communication
- Uses `RegistrationModal` component

### 3. Backend API (Spring Boot)
**Location:** `backend/src/main/java/...`
**Purpose:** Business logic and data persistence
**Components:**

#### RegistrationController
- Endpoint: `POST /api/registrations`
- Accepts: RegisterAttendeeRequest
- Returns: TicketIssuedResponse

#### RegistrationService
- Event validation
- Duplicate prevention
- Attendee creation
- Ticket generation
- QR code signing

#### TelegramBotClient
- `sendMessage(message)` - Default chat
- `sendMessageToUser(userId, message)` - Specific user
- `sendMessageWithWebAppButton()` - With button

### 4. Database (PostgreSQL)
**Tables:**
- `events` - Event information
- `attendees` - Registered users
- `tickets` - Generated tickets
- `users` - Admin/staff accounts

## Data Flow

### Registration Request
```json
POST /api/registrations
{
  "eventCode": "TECH2026",
  "telegramUserId": 123456789,
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Tech Corp"
}
```

### Registration Response
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "ticketNo": "T-AB12CD34",
    "eventTitle": "Tech Conference 2026",
    "attendeeName": "John Doe",
    "qrCode": "t=uuid&e=TECH2026&ts=123456&sig=abc123",
    "issuedAt": "2026-01-12T10:30:00Z"
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "traceId": "abc-123"
}
```

### Telegram Notification
```
✅ Registration Confirmed!

📅 Event: Tech Conference 2026
🎫 Ticket: T-AB12CD34
📍 Location: Convention Center
🕒 Date: 2026-03-15 09:00

Please save your QR code for check-in.
```

## Security Flow

### 1. Web App Validation
```javascript
// Web App gets initialization data
let tg = window.Telegram.WebApp;
let user = tg.initDataUnsafe.user;

// Contains:
// - user.id (Telegram user ID)
// - user.first_name
// - user.last_name
// - user.username
```

### 2. Backend Validation (TODO)
```java
// Should verify initData signature
// Using bot token as secret
// Prevents fake requests
```

### 3. QR Code Signing
```java
String base = "t=" + ticketId + "&e=" + eventCode + "&ts=" + timestamp;
String signature = HMAC-SHA256(qrSecret, base);
String qrPayload = base + "&sig=" + signature;
```

## API Endpoints

### Public Endpoints
```
GET  /api/events              - List all events (paginated)
GET  /api/events/{hashId}     - Get event details
POST /api/registrations       - Register for event
POST /api/check-in            - Check-in with QR code
```

### Admin Endpoints (Requires Authentication)
```
POST   /api/events            - Create event (ADMIN/STAFF)
PUT    /api/admin/events/{id} - Update event (ADMIN)
DELETE /api/admin/events/{id} - Delete event (ADMIN)
GET    /api/admin/attendees   - List attendees (ADMIN/STAFF)
```

## Configuration Files

### Backend - application.yaml
```yaml
telegram:
  bot:
    token: "${TELEGRAM_BOT_TOKEN}"
    chat-id: "${TELEGRAM_CHAT_ID}"

hashid:
  salt: "${HASHID_SALT}"
  min-length: 6
```

### Bot - .env
```bash
TELEGRAM_BOT_TOKEN=1234567890:ABCdef...
WEB_APP_URL=https://your-domain.com/register.html
```

### Web App - register.html
```javascript
const apiUrl = 'https://your-api-domain.com/api/registrations';
```

## Deployment Checklist

- [ ] Create Telegram bot via @BotFather
- [ ] Get bot token
- [ ] Host register.html (HTTPS required)
- [ ] Update API URL in register.html
- [ ] Configure application.yaml with bot token
- [ ] Deploy backend API
- [ ] Update WEB_APP_URL in bot.py
- [ ] Deploy Telegram bot (Python)
- [ ] Test complete flow
- [ ] Set up monitoring and logs

## Testing

### 1. Local Development
```bash
# Terminal 1: Backend
cd backend
./mvnw spring-boot:run

# Terminal 2: Frontend (with ngrok)
cd frontend
python3 -m http.server 8080
# In another terminal:
ngrok http 8080

# Terminal 3: Bot
cd telegram-bot
source venv/bin/activate
python bot.py
```

### 2. Test Flow
1. Message bot: `/start`
2. Click "Register for Event" button
3. Fill form in Web App
4. Submit registration
5. Check Telegram for confirmation
6. Verify in database

### 3. Check Logs
```bash
# Backend logs
tail -f backend/logs/application.log

# Bot logs (if using systemd)
journalctl -u event-bot -f
```

## Troubleshooting

### Issue: Web App shows blank page
**Solution:** Web App must be opened from Telegram, not browser directly

### Issue: No Telegram notification
**Check:**
- Bot token in application.yaml
- TelegramBotClient logs in backend
- User's Telegram ID is correct

### Issue: CORS error
**Solution:** Add Web App domain to CORS configuration in WebConfig.java

### Issue: "Event not found"
**Solution:** Verify eventCode exists and event status is not CLOSED
