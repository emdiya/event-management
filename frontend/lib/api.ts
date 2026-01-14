/**
 * API Service Layer
 * Centralizes all backend API calls
 */

import axiosInstance from "./axios"

// ============================================
// Type Definitions (Backend Response Format)
// ============================================

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
  traceId: string
}

export interface PaginationMetadata {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface PaginationResponse<T> {
  success: boolean
  message: string
  data: T[]
  pagination: PaginationMetadata
  timestamp: string
  traceId: string
}

// Event Types
export interface EventResponse {
  id: string
  hashId: string
  code: string
  title: string
  description: string
  location: string
  startAt: string
  endAt: string
  status: "DRAFT" | "PUBLISHED" | "CLOSED"
}

export interface CreateEventRequest {
  title: string
  description: string
  location: string
  startAt: string // ISO 8601 format
  endAt: string // ISO 8601 format
  status?: "DRAFT" | "PUBLISHED" | "CLOSED"
}

// Registration Types
export interface RegisterAttendeeRequest {
  eventCode: string
  telegramUserId?: number
  fullName: string
  phone?: string
  email?: string
  company?: string
}

export interface TicketIssuedResponse {
  ticketNo: string
  eventTitle: string
  attendeeName: string
  qrCode: string
  issuedAt: string
}

// Admin Types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    email: string
    fullName: string
    role: string
  }
}

export interface AttendeeStats {
  totalAttendees: number
  checkedInCount: number
  pendingCount: number
}

// ============================================
// API Service Functions
// ============================================

/**
 * Event API Endpoints
 */
export const eventAPI = {
  /**
   * Get all events (public) with pagination and filters
   */
  async getAll(params?: {
    page?: number
    size?: number
    title?: string
    status?: "DRAFT" | "PUBLISHED" | "CLOSED"
  }): Promise<PaginationResponse<EventResponse>> {
    const queryParams = new URLSearchParams()
    if (params?.page !== undefined) queryParams.append("page", params.page.toString())
    if (params?.size !== undefined) queryParams.append("size", params.size.toString())
    if (params?.title) queryParams.append("title", params.title)
    if (params?.status) queryParams.append("status", params.status)

    const { data } = await axiosInstance.get(`/api/events?${queryParams.toString()}`)
    return data
  },

  /**
   * Get single event by hashId (public)
   */
  async getByHashId(hashId: string): Promise<ApiResponse<EventResponse>> {
    const { data } = await axiosInstance.get(`/api/events/${hashId}`)
    return data
  },

  /**
   * Create new event (requires ADMIN/STAFF role)
   */
  async create(request: CreateEventRequest): Promise<ApiResponse<EventResponse>> {
    const { data } = await axiosInstance.post("/api/events", request)
    return data
  },
}

/**
 * Registration API Endpoints
 */
export const registrationAPI = {
  /**
   * Register attendee for an event
   */
  async register(request: RegisterAttendeeRequest): Promise<ApiResponse<TicketIssuedResponse>> {
    const { data } = await axiosInstance.post("/api/registrations", request)
    return data
  },
}

/**
 * Admin API Endpoints
 */
export const adminAPI = {
  /**
   * Admin login
   */
  async login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const { data } = await axiosInstance.post("/api/auth/login", request)
    return data
  },

  /**
   * Get all events (admin view)
   */
  async getAllEvents(params?: { page?: number; size?: number }): Promise<PaginationResponse<EventResponse>> {
    const queryParams = new URLSearchParams()
    if (params?.page !== undefined) queryParams.append("page", params.page.toString())
    if (params?.size !== undefined) queryParams.append("size", params.size.toString())

    const { data } = await axiosInstance.get(`/api/admin/events?${queryParams.toString()}`)
    return data
  },

  /**
   * Update event (full update)
   */
  async updateEvent(
    hashId: string,
    request: CreateEventRequest
  ): Promise<ApiResponse<EventResponse>> {
    const { data } = await axiosInstance.patch(`/api/admin/events/${hashId}`, request)
    return data
  },

  /**
   * Update event status only
   */
  async updateEventStatus(
    hashId: string,
    status: "DRAFT" | "PUBLISHED" | "CLOSED",
  ): Promise<ApiResponse<EventResponse>> {
    const { data } = await axiosInstance.patch(`/api/admin/events/${hashId}/status`, { status })
    return data
  },

  /**
   * Delete event
   */
  async deleteEvent(eventId: string): Promise<ApiResponse<void>> {
    const { data } = await axiosInstance.delete(`/api/admin/events/${eventId}`)
    return data
  },

  /**
   * Get attendee count for event
   */
  async getAttendeeCount(eventId: number): Promise<ApiResponse<{ count: number }>> {
    const { data } = await axiosInstance.get(`/api/admin/events/${eventId}/attendees/count`)
    return data
  },

  /**
   * Get checked-in count for event
   */
  async getCheckedInCount(eventId: number): Promise<ApiResponse<{ count: number }>> {
    const { data } = await axiosInstance.get(`/api/admin/events/${eventId}/attendees/checked-in/count`)
    return data
  },
}

/**
 * Check-in API Endpoints
 */
export const checkinAPI = {
  /**
   * Check-in attendee with QR code
   */
  async checkIn(qrPayload: string): Promise<ApiResponse<{ message: string; attendeeName: string }>> {
    const { data } = await axiosInstance.post("/api/check-in", { qrPayload })
    return data
  },
}

// Export all APIs as a single object
const api = {
  events: eventAPI,
  registration: registrationAPI,
  admin: adminAPI,
  checkin: checkinAPI,
}

export default api
