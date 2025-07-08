// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';

import HomePage     from './pages/HomePage';
import OAuthHandler from './pages/OAuthHandler';
import ChooseRole   from './pages/ChooseRole';
import AdminPage    from './pages/AdminPage';
import StudentPage  from './pages/StudentPage';
import ProtectedRoute from './components/ProtectedRoute';

const container = document.getElementById('root');
const root      = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/oauth" element={<OAuthHandler />} />
          <Route path="/choose-role" element={<ChooseRole />} />
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
          <Route element={<ProtectedRoute role="student" />}>
            <Route path="/student" element={<StudentPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
