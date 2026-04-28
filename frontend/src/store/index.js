import { configureStore } from '@reduxjs/toolkit'
import collectionReducer from './collectionSlice.js'

export const store = configureStore({
  reducer: {
    collection: collectionReducer,
  },
})
