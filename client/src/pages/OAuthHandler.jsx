import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../features/auth/authSlice';

export default function OAuthHandler() {
  const [searchParams] = useSearchParams();
  const token          = searchParams.get('token');
  const navigate       = useNavigate();
  const dispatch       = useDispatch();

  useEffect(() => {
    if (!token) return navigate('/', { replace: true });
    localStorage.setItem('token', token);

    dispatch(fetchCurrentUser())
      .unwrap()
      .then(user => {
        const dest = user.role === 'admin' ? '/admin' : '/student';
        navigate(dest, { replace: true });
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/', { replace: true });
      });
  }, [token, dispatch, navigate]);

  return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Signing you in…</p>;
}
