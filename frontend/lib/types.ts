// ============================================
// Backend API Response Types
// ============================================

export interface EventResponse {
  hashId: string
  code: string
  title: string
  description: string
  location: string
  startAt: string // ISO 8601 format
  endAt: string // ISO 8601 format
  status: "DRAFT" | "PUBLISHED" | "CLOSED"
  maxAttendees: number
  createdAt: string
  updatedAt: string
}

export interface TicketResponse {
  ticketNo: string
  eventTitle: string
  attendeeName: string
  qrCode: string
  issuedAt: string
}

export interface AttendeeResponse {
  id: number
  telegramUserId: number
  fullName: string
  phone?: string
  email?: string
  company?: string
  createdAt: string
}

// ============================================
// Legacy Types (for backward compatibility)
// ============================================

export interface Event {
  id: string
  title: string
  description: string
  date: string
  start_time: string
  end_time: string
  location: string
  max_capacity?: number
  current_attendance: number
  created_at: string
  updated_at: string
}

export interface Attendee {
  id: string
  event_id: string
  name: string
  email: string
  phone?: string
  registration_date: string
  checked_in: boolean
  checked_in_at?: string
  qr_code: string
  status: string
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  created_at: string
}

export interface RegistrationData {
  eventCode: string
  telegramUserId?: number
  fullName: string
  phone: string
  email: string
  company?: string
}
