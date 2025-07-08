import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ role }) {
  const { token, user } = useSelector(state => state.auth);

  // 1) Not authenticated at all?
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // 2) Authenticated but wrong role?
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // 3) OK, render the nested routes
  return <Outlet />;
}
