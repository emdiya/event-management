import { createSlice } from "@reduxjs/toolkit"

interface UIState {
  isDarkMode: boolean
  sidebarOpen: boolean
}

const initialState: UIState = {
  isDarkMode: false,
  sidebarOpen: true,
}

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
  },
})

export const { toggleDarkMode, setSidebarOpen } = uiSlice.actions
export default uiSlice.reducer
