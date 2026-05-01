import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { CollectionCard } from '../types/card'

interface CollectionState {
  cards: CollectionCard[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: CollectionState = {
  cards: [],
  status: 'idle',
  error: null,
}

export const fetchCollection = createAsyncThunk<CollectionCard[]>(
  'collection/fetchAll',
  async () => {
    const response = await fetch('/api/collection')
    if (!response.ok) throw new Error('Failed to fetch collection')
    return response.json() as Promise<CollectionCard[]>
  }
)

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollection.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCollection.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.cards = action.payload
      })
      .addCase(fetchCollection.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Unknown error'
      })
  },
})

export default collectionSlice.reducer
