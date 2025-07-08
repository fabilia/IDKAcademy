import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import StudentPage from './pages/StudentPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Home (welcome / login / register) */}
        <Route path="/" element={<HomePage />} />

        {/* Admin-only routes */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        {/* Student-only routes */}
        <Route element={<ProtectedRoute role="student" />}>
          <Route path="/student" element={<StudentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
