# 📅 Event Management System

A full-stack **Event Management System** designed to manage events, registrations, and on-site check-ins using **QR codes** and **Telegram integration**.

This system enables administrators to create events, users to register easily via Telegram or web, and staff to perform fast, secure check-ins using a QR scanner on mobile devices.

---

## 🚀 Features

### 👤 Admin & Staff
- Create and manage events (start / end date)
- Publish or close events
- Role-based access control (ADMIN / STAFF)
- Scan attendee QR codes for check-in
- Prevent duplicate or invalid check-ins

### 🙋 Attendees
- Register for events via Telegram bot or web link
- Submit personal information
- Receive a digital ticket with QR code
- Quick, contactless check-in at event

### 🤖 Telegram Bot
- `/start` command to begin registration
- Event selection inside Telegram
- WebApp form for attendee data
- QR ticket delivered via Telegram message

### 🔐 Security
- Spring Security with roles
- Protected admin & staff APIs
- Secure QR validation
- Password encryption (BCrypt)

---

## 🧱 Tech Stack

| Layer | Technology |
|-----|-----------|
| Backend | Spring Boot (Java) |
| Frontend | Next.js (React) |
| Database | PostgreSQL |
| Security | Spring Security |
| QR Code | ZXing |
| Bot | Telegram Bot API |
| API Docs | Swagger (SpringDoc) |

---

## 📚 Documentation

- **[Telegram Bot Integration Guide](TELEGRAM_INTEGRATION.md)** - Complete setup guide for Telegram bot and Web App
- **[Authentication Guide](AUTH_GUIDE.md)** - API authentication and authorization

---

### Develop by Diya
