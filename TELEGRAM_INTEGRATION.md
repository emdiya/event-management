# Telegram Bot Integration Guide

This guide explains how to integrate your Event Management System with Telegram Bot and Web App.

## Architecture

```
User → Telegram Bot → Web App → Backend API → Telegram Notification
```

1. User starts bot and clicks "Register" button
2. Telegram opens your Web App (`/telegram/register`)
3. Web App gets Telegram user ID automatically
4. User fills form and submits to backend API
5. Backend saves registration and sends confirmation via Telegram

## Setup Steps

### 1. Create Telegram Bot

1. Open Telegram and message [@BotFather](https://t.me/botfather)
2. Send `/newbot`
3. Follow instructions to create your bot
4. Save the **Bot Token** (e.g., `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Configure Bot with BotFather

```
/setname - Set bot display name
/setdescription - Set bot description
/setabouttext - Set about text
/setcommands - Set command list
```

**Command list to set:**
```
start - Start the bot
register - Register for an event
mytickets - View your tickets
help - Show help message
```

### 3. Setup Web App (Next.js)

1. Deploy the frontend and make sure `/telegram/register` is reachable.
2. Set the Web App base URL in backend config (see step 4).
3. The bot will open: `https://yourdomain.com/telegram/register?code=EVENT_CODE`

#### Local Development (ngrok)

```bash
# Terminal 1: Run Next.js
cd frontend
npm run dev

# Terminal 2: Expose with ngrok
ngrok http 3000
# Use the HTTPS URL as TELEGRAM_WEB_APP_BASE_URL (e.g., https://abc123.ngrok.io)
```

### 4. Configure Backend

Update `backend/src/main/resources/application.yaml`:

```yaml
telegram:
  bot:
    token: "YOUR_BOT_TOKEN_FROM_BOTFATHER"
    chat-id: "YOUR_ADMIN_CHAT_ID"  # For admin notifications
    web-app-base-url: "https://yourdomain.com"  # Base URL for Telegram Web App
```

**Get your chat ID:**
1. Message your bot from Telegram
2. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Find your chat ID in the JSON response

### 5. Configure Telegram Webhook (Backend)

Set the webhook to your backend endpoint:

```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-api-domain.com/api/telegram/webhook
```

### 6. Update Web App API URL

Set `NEXT_PUBLIC_API_URL` in your frontend environment:

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## How It Works

### User Flow

1. **User starts bot:**
   ```
   User: /start
   Bot: Shows "Register for Event" button (Web App)
   ```

2. **User clicks button:**
   - Telegram opens Web App (`/telegram/register`)
   - Web App gets `user.id` from Telegram
   - Form is pre-filled with user's name

3. **User submits registration:**
   - Web App sends POST to `/api/registrations`
   - Request body includes `telegramUserId`

4. **Backend processes:**
   - Validates event exists
   - Creates attendee + ticket
   - Sends confirmation via Telegram Bot

5. **User receives confirmation:**
   ```
   ✅ Registration Confirmed!
   
   📅 Event: Tech Conference 2026
   🎫 Ticket: T-AB12CD34
   ```

### API Request Example

**POST** `/api/registrations`

```json
{
  "eventCode": "TECH2026",
  "telegramUserId": 123456789,
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Tech Corp"
}
```

### Backend Response

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "ticketNo": "T-AB12CD34",
    "eventTitle": "Tech Conference 2026",
    "qrCode": "t=uuid&e=TECH2026&ts=123456&sig=abc123",
    "issuedAt": "2026-01-12T10:30:00Z"
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "traceId": "abc-123-def"
}
```

## Security Considerations

### 1. Validate Telegram Data

The Web App sends initialization data that should be validated on backend:

```java
// TODO: Add validation for tg.initDataUnsafe
// Verify the data came from Telegram using bot token
```

### 2. CORS Configuration

Update `WebConfig.java` to allow your Web App domain:

```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
        .allowedOrigins(
            "https://your-domain.com",
            "https://t.me"
        )
        .allowedMethods("GET", "POST", "PUT", "DELETE")
        .allowCredentials(true);
}
```

### 3. Rate Limiting

Add rate limiting to prevent spam registrations:

```java
// TODO: Implement rate limiting on registration endpoint
// Limit: 5 registrations per user per hour
```

## Testing

### 1. Test Web App Locally

1. Run the frontend and open `http://localhost:3000/telegram/register?code=TEST123`
2. Use [Telegram Web App Debugger](https://core.telegram.org/bots/webapps#debug-mode)

### 2. Test with Bot

1. Configure webhook to the backend endpoint
2. Send `/events` or `/register <EVENT_CODE>`
3. Open the Web App button
4. Fill and submit form
5. Check for confirmation message

### 3. Test Backend

```bash
curl -X POST http://localhost:8080/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "eventCode": "TEST123",
    "telegramUserId": 123456789,
    "fullName": "Test User",
    "email": "test@example.com"
  }'
```

## Troubleshooting

### Web App doesn't open
- Check TELEGRAM_WEB_APP_BASE_URL is HTTPS (required by Telegram)
- Verify URL is publicly accessible
- Check browser console for errors

### No Telegram notification received
- Verify bot token in application.yaml
- Check telegramUserId is correct
- Look for errors in backend logs
- Test with: `/api/registrations` endpoint

### "User not found" error
- Web App must be opened from Telegram bot
- Check `tg.initDataUnsafe.user` is populated
- Verify Telegram SDK script is loaded

### CORS errors
- Update allowed origins in WebConfig
- Ensure `https://t.me` is allowed
- Check browser console for specific error

## Production Deployment

### 1. Deploy Backend
```bash
cd backend
./mvnw clean package -DskipTests
java -jar target/event-management-backend-*.jar
```

### 2. Deploy Frontend (Next.js)
- Deploy the frontend app (Vercel, Netlify, or your server)
- Ensure HTTPS is enabled
- Set `NEXT_PUBLIC_API_URL`

### 3. Configure Webhook
- Point Telegram webhook to your backend URL

### 4. Monitor
- Check bot logs: `tail -f bot.log`
- Monitor backend logs: `tail -f logs/application.log`
- Set up alerts for errors

## Advanced Features

### 1. Deep Links

Allow users to share event registration links:
```
https://t.me/yourbot?start=EVENT_CODE
```

Parse in bot:
```python
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    args = context.args
    if args and args[0]:
        event_code = args[0]
        # Auto-open Web App with event code
```

### 2. QR Code in Telegram

Send QR code image after registration:
```python
import qrcode
from io import BytesIO

qr = qrcode.make(qr_payload)
bio = BytesIO()
qr.save(bio, 'PNG')
bio.seek(0)

await context.bot.send_photo(
    chat_id=user_id,
    photo=bio,
    caption="Your ticket QR code"
)
```

### 3. Inline Keyboards

Add action buttons to messages:
```python
keyboard = [
    [InlineKeyboardButton("View Ticket", callback_data=f"view_{ticket_id}")],
    [InlineKeyboardButton("Cancel Registration", callback_data=f"cancel_{ticket_id}")]
]
```

## Resources

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Web Apps](https://core.telegram.org/bots/webapps)
- [Web App Examples](https://github.com/Telegram-Web-Apps)
