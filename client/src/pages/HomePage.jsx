// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  registerUser,
  clearMessage
} from '../features/auth/authSlice';
import styles from './HomePage.module.css';

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, message, user } = useSelector(s => s.auth);

  // 1) Read any ?message= flash once
  const [searchParams] = useSearchParams();
  const [flashMsg] = useState(() => searchParams.get('message') || null);

  // 2) Form / mode state
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name:     '',
    email:    '',
    password: '',
    role:     'student'
  });

  // 3) On successful auth, redirect by role
  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/student', {
        replace: true
      });
    }
  }, [user, navigate]);

  // 4) Clear server-side messages whenever we toggle mode
  useEffect(() => {
    dispatch(clearMessage());
  }, [isLogin, dispatch]);

  const handleLogin = () =>
    dispatch(loginUser({ email: form.email, password: form.password }))
      .unwrap()
      .catch(() => { /* errors appear via `error` */ });

  const handleRegister = () =>
    dispatch(
      registerUser({
        name:     form.name,
        email:    form.email,
        password: form.password,
        role:     form.role
      })
    )
      .unwrap()
      .catch(() => { /* errors via `error` */ });

  const googleUrl = `http://localhost:5000/api/auth/google`;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>

        {/* Flash from URL */}
        {flashMsg && (
          <div className={styles.error}>
            {flashMsg === 'already_registered'
              ? 'You already have an account—please sign in.'
              : flashMsg}
          </div>
        )}

        {/* Server messages */}
        {message && <div className={styles.success}>{message}</div>}
        {error   && <div className={styles.error}>{error}</div>}

        {/* Name (only on register) */}
        {!isLogin && (
          <input
            className={styles.input}
            placeholder="Name"
            value={form.name}
            onChange={e =>
              setForm(f => ({ ...f, name: e.target.value }))
            }
          />
        )}

        {/* Email */}
        <input
          className={styles.input}
          placeholder="Email"
          value={form.email}
          onChange={e =>
            setForm(f => ({ ...f, email: e.target.value }))
          }
        />

        {/* Password */}
        <input
          type="password"
          className={styles.input}
          placeholder="Password"
          value={form.password}
          onChange={e =>
            setForm(f => ({ ...f, password: e.target.value }))
          }
        />

        {/* Role select (only on register) */}
        {!isLogin && (
          <select
            className={styles.input}
            value={form.role}
            onChange={e =>
              setForm(f => ({ ...f, role: e.target.value }))
            }
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        )}

        {/* Login or Register */}
        <button
          className={styles.submit}
          onClick={isLogin ? handleLogin : handleRegister}
          disabled={status === 'loading'}
        >
          {isLogin ? 'Login' : 'Register'}
        </button>

        {/* Google OAuth */}
        <a
          href={googleUrl}
          className={styles.googleBtn}
        >
          {isLogin ? 'Sign in with Google' : 'Register with Google'}
        </a>

        {/* Toggle between Login / Register */}
        <button
          type="button"
          className={styles.toggle}
          onClick={() => {
            setIsLogin(!isLogin);
            setForm({ name:'', email:'', password:'', role:'student' });
          }}
        >
          {isLogin ? 'Go to Register' : 'Go to Login'}
        </button>
      </div>
    </div>
  );
}
