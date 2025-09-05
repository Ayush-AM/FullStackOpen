// src/features/notificationSlice.js
import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return null
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions

// 6.19: Improved notification action creator
export const showNotification = (message, durationInSeconds = 5) => {
  return async (dispatch) => {
    const durationInMs = durationInSeconds * 1000
    
    // Clear any existing timeout
    if (window.notificationTimeout) {
      clearTimeout(window.notificationTimeout)
    }
    
    dispatch(setNotification(message))
    
    window.notificationTimeout = setTimeout(() => {
      dispatch(clearNotification())
    }, durationInMs)
  }
}

export default notificationSlice.reducer