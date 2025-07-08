import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import scoresReducer from '../features/scores/scoresSlice';
import usersReducer from '../features/auth/authSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    scores: scoresReducer,
    students: usersReducer,
  }
});