import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api, { type RegisterAttendeeRequest, type TicketIssuedResponse } from "@/lib/api"

interface RegistrationState {
  loading: boolean
  error: string | null
  success: boolean
  ticket: TicketIssuedResponse | null
}

const initialState: RegistrationState = {
  loading: false,
  error: null,
  success: false,
  ticket: null,
}

export const submitRegistration = createAsyncThunk(
  "registration/submit",
  async (data: RegisterAttendeeRequest, { rejectWithValue }) => {
    try {
      const response = await api.registration.register(data)
      console.log("[RegistrationSlice] Registration success:", response)
      return response.data
    } catch (error: any) {
      console.error("[RegistrationSlice] Registration error:", error)
      return rejectWithValue(error.response?.data?.message || error.message || "Registration failed")
    }
  },
)

export const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    resetRegistration: (state) => {
      state.loading = false
      state.error = null
      state.success = false
      state.ticket = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitRegistration.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(submitRegistration.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.ticket = action.payload
      })
      .addCase(submitRegistration.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.success = false
        state.ticket = null
      })
  },
})

export const { resetRegistration } = registrationSlice.actions
export default registrationSlice.reducer
