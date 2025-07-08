import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../features/auth/authSlice';
import styles from './HomePage.module.css';

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    setMessage(null);
    setError(null);
    const thunk = isLogin ? loginUser : registerUser;
    dispatch(thunk(form))
      .unwrap()
      .then(payload => {
        if (isLogin) {
          localStorage.setItem('token', payload.token);
          navigate(payload.role === 'admin' ? '/admin' : '/student');
        } else {
          setMessage(payload.message);
        }
      })
      .catch(err => setError(err.message));
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>

        {message && <div className={styles.success}>{message}</div>}
        {error   && <div className={styles.error}>{error}</div>}

        <button
          type="button"
          className={styles.toggle}
          onClick={() => {setIsLogin(!isLogin); setMessage(null); setError(null);}}
        >
          {isLogin ? 'Go to Register' : 'Go to Login'}
        </button>

        {!isLogin && (
          <input
            className={styles.input}
            placeholder="Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
        )}

        <input
          className={styles.input}
          placeholder="Email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />

        <input
          type="password"
          className={styles.input}
          placeholder="Password"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
        />

        {!isLogin && (
          <select
            className={styles.input}
            value={form.role}
            onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        )}

        <button className={styles.submit} onClick={handleSubmit}>
          {isLogin ? 'Login' : 'Register'}
        </button>

        {/* Google OAuth Button moved below submit */}
        <a
            href="http://localhost:5000/api/auth/google"
            className={styles.googleBtn}
            style={{ marginTop: '1rem', display: 'block', textAlign: 'center' }}
            >
            Sign in with Google
        </a>
      </div>
    </div>
  );
}