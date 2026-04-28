import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchCollection = createAsyncThunk(
  'collection/fetchAll',
  async () => {
    const response = await fetch('/api/collection')
    if (!response.ok) throw new Error('Failed to fetch collection')
    return response.json()
  }
)

const collectionSlice = createSlice({
  name: 'collection',
  initialState: {
    cards: [],
    status: 'idle',   // idle | loading | succeeded | failed
    error: null,
  },
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
        state.error = action.error.message
      })
  },
})

export default collectionSlice.reducer
