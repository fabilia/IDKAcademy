import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../features/auth/authSlice';

export default function OAuthHandler() {
  const { search } = useLocation();
  const navigate   = useNavigate();
  const dispatch   = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token  = params.get('token');
    if (!token) return navigate('/', { replace:true });

    localStorage.setItem('token', token);
    dispatch(fetchCurrentUser())
      .unwrap()
      .then(user => {
        // If no role yet, ask them to choose
        if (!user.role) {
          navigate('/choose-role', { replace:true });
        } else {
          navigate(user.role === 'admin' ? '/admin' : '/student', { replace:true });
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/', { replace:true });
      });
  }, [search, dispatch, navigate]);

  return <p style={{textAlign:'center',marginTop:'2rem'}}>Signing you in…</p>;
}
