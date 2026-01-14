import { configureStore } from "@reduxjs/toolkit"
import eventsReducer from "./slices/eventsSlice"
import uiReducer from "./slices/uiSlice"
import registrationReducer from "./slices/registrationSlice"

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    ui: uiReducer,
    registration: registrationReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
