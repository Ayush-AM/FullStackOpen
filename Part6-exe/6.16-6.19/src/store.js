// src/store.js
import { configureStore } from '@reduxjs/toolkit'
import anecdotesReducer from './features/anecdotesSlice'
import filterReducer from './features/filterSlice'
import notificationReducer from './features/notificationSlice'

const store = configureStore({
  reducer: {
    anecdotes: anecdotesReducer,
    filter: filterReducer,
    notification: notificationReducer
  }
})

export default store