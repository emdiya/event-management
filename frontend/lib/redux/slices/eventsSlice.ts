import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api, { type EventResponse, type PaginationResponse } from "@/lib/api"

interface EventsState {
  items: EventResponse[]
  loading: boolean
  error: string | null
  pagination: {
    currentPage: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  } | null
  filter: {
    title?: string
    status?: "DRAFT" | "PUBLISHED" | "CLOSED"
  }
}

const initialState: EventsState = {
  items: [],
  loading: false,
  error: null,
  pagination: null,
  filter: {},
}

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (
    params: {
      page?: number
      size?: number
      title?: string
      status?: "DRAFT" | "PUBLISHED" | "CLOSED"
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const response = await api.events.getAll(params)
      console.log("[EventsSlice] API Response:", response)
      console.log("[EventsSlice] Response.data:", response.data)
      console.log("[EventsSlice] Response.pagination:", response.pagination)
      return response
    } catch (error: any) {
      console.error("[EventsSlice] API Error:", error)
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch events")
    }
  },
)

export const fetchEventByHashId = createAsyncThunk(
  "events/fetchEventByHashId",
  async (hashId: string, { rejectWithValue }) => {
    try {
      const response = await api.events.getByHashId(hashId)
      console.log("[EventsSlice] Fetch single event:", response)
      return response.data
    } catch (error: any) {
      console.error("[EventsSlice] Fetch single event error:", error)
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch event")
    }
  },
)

export const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload
    },
    clearFilter: (state) => {
      state.filter = {}
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.data || []
        state.pagination = action.payload.pagination
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.items = []
      })
      // Fetch single event
      .addCase(fetchEventByHashId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEventByHashId.fulfilled, (state, action) => {
        state.loading = false
        // Add or update the event in items
        const index = state.items.findIndex((e) => e.hashId === action.payload.hashId)
        if (index >= 0) {
          state.items[index] = action.payload
        } else {
          state.items.push(action.payload)
        }
      })
      .addCase(fetchEventByHashId.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setFilter, clearFilter, clearError } = eventsSlice.actions
export default eventsSlice.reducer
