// src/features/auth/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Thunk: login with email/password
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data; // { token, role, name, id }
    } catch (err) {
      // return the error message payload
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Thunk: register with email/password
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password, role }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
      });
      return response.data; // { message: 'Registered! …' }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Thunk: fetch current user profile (after setting token)
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      return response.data; // { id, name, role, email }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  user: null,                         // { id, name, role, email }
  token: localStorage.getItem('token'), 
  status: 'idle',                     // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,                        // error message
  message: null,                      // success message for register
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('token');
    },
    clearMessage(state) {
      state.message = null;
    }
  },
  extraReducers: builder => {
    builder
      // loginUser
      .addCase(loginUser.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          role: action.payload.role,
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // registerUser
      .addCase(registerUser.pending, state => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // fetchCurrentUser
      .addCase(fetchCurrentUser.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { logout, clearMessage } = authSlice.actions;
export default authSlice.reducer;
