import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// existing:
export const fetchScores = createAsyncThunk('scores/fetch', async (params) => {
  const res = await api.get('/scores', { params });
  return res.data;
});
export const createScore = createAsyncThunk('scores/create', async (data) => {
  const res = await api.post('/scores', data);
  return res.data;
});

// NEW:
export const updateScore = createAsyncThunk(
  'scores/update',
  async ({ id, subject, score, feedback }) => {
    const res = await api.put(`/scores/${id}`, { subject, score, feedback });
    return res.data;
  }
);

export const deleteScore = createAsyncThunk(
  'scores/delete',
  async (id) => {
    await api.delete(`/scores/${id}`);
    return id;  // return deleted ID so we can filter it out
  }
);

const slice = createSlice({
  name: 'scores',
  initialState: { list: [], pageInfo: {}, status: null },
  extraReducers: builder => {
    builder
      .addCase(fetchScores.fulfilled, (state, { payload }) => {
        state.list = payload.docs;
        state.pageInfo = { page: payload.page, totalPages: payload.totalPages };
      })
      .addCase(createScore.fulfilled, (state, { payload }) => {
        state.list.unshift(payload);
      })
      .addCase(updateScore.fulfilled, (state, { payload }) => {
        state.list = state.list.map(s => s._id === payload._id ? payload : s);
      })
      .addCase(deleteScore.fulfilled, (state, { payload: id }) => {
        state.list = state.list.filter(s => s._id !== id);
      });
  }
});

export default slice.reducer;
