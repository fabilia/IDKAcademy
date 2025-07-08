// src/pages/AdminPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchScores,
  createScore,
  updateScore,
  deleteScore
} from '../features/scores/scoresSlice';
import { logout } from '../features/auth/authSlice';
import api from '../api/axios';
import styles from './AdminPage.module.css';

export default function AdminPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state for scores
  const { list: scores, status: scoresStatus, error: scoresError } =
    useSelector(state => state.scores);

  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState('');
  const [form, setForm] = useState({
    id:     null,
    subject:'',
    score:  '',
    feedback:''
  });
  const [message, setMessage] = useState({ type:'', text:'' });

  // Load students once
  useEffect(() => {
    api.get('/users', { params:{ role:'student' }})
      .then(r => setStudents(r.data))
      .catch(() =>
        setMessage({ type:'error', text:'Failed to load students.' })
      );
  }, []);

  // Fetch scores when a student is selected
  useEffect(() => {
    if (selected) {
      dispatch(fetchScores({ studentId:selected, page:1, limit:100 }));
      setForm({ id:null, subject:'', score:'', feedback:'' });
      setMessage({ type:'', text:'' });
    }
  }, [selected, dispatch]);

  // Refresh scores after any CRUD
  const reloadScores = () => {
    if (selected) {
      dispatch(fetchScores({ studentId:selected, page:1, limit:100 }));
    }
  };

  const handleSave = async () => {
    if (!selected || !form.subject.trim() || form.score === '') {
      return setMessage({ type:'error', text:'Please fill all required fields.' });
    }
    setMessage({ type:'', text:'' });
    try {
      if (form.id) {
        // update existing
        await dispatch(updateScore({
          id:      form.id,
          student: selected,
          subject: form.subject,
          score:   form.score,
          feedback: form.feedback
        })).unwrap();
        setMessage({ type:'success', text:'Score updated.' });
      } else {
        // create new
        await dispatch(createScore({
          student: selected,
          subject: form.subject,
          score:   form.score,
          feedback: form.feedback
        })).unwrap();
        setMessage({ type:'success', text:'Score added.' });
      }
      setForm({ id:null, subject:'', score:'', feedback:'' });
      reloadScores();
    } catch (err) {
      setMessage({ type:'error', text: err.message });
    }
  };

  const handleDelete = async id => {
    try {
      await dispatch(deleteScore(id)).unwrap();
      setMessage({ type:'success', text:'Score deleted.' });
      reloadScores();
    } catch (err) {
      setMessage({ type:'error', text: err.message });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Student Score Manager</h2>
          <button className={styles.logout} onClick={handleLogout}>
            Logout
          </button>
        </div>

        {message.text && (
          <div
            className={message.type === 'error' ? styles.error : styles.success}
          >
            {message.text}
          </div>
        )}

        {/* Student selector */}
        <select
          className={styles.input}
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="">— Select Student —</option>
          {students.map(s => (
            <option key={s._id} value={s._id}>
              {s.name} ({s.email})
            </option>
          ))}
        </select>

        {selected && (
          <>
            {/* Score form */}
            <input
              className={styles.input}
              placeholder="Subject *"
              value={form.subject}
              onChange={e => setForm(f=>({...f,subject:e.target.value}))}
            />
            <input
              type="number"
              className={styles.input}
              placeholder="Score (0–100) *"
              value={form.score}
              onChange={e => setForm(f=>({...f,score:e.target.value}))}
            />
            <textarea
              className={styles.input}
              rows="3"
              placeholder="Feedback"
              value={form.feedback}
              onChange={e => setForm(f=>({...f,feedback:e.target.value}))}
            />
            <button
              className={styles.submit}
              onClick={handleSave}
              disabled={scoresStatus === 'loading'}
            >
              {form.id ? 'Update Score' : 'Add Score'}
            </button>

            {/* Scores table */}
            {scoresError && <div className={styles.error}>{scoresError}</div>}
            {scores.length > 0 && (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Feedback</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map(s => (
                    <tr key={s._id}>
                      <td>{s.subject}</td>
                      <td>{s.score}</td>
                      <td>{s.feedback}</td>
                      <td>
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          className={styles.smallBtn}
                          onClick={() =>
                            setForm({
                              id:       s._id,
                              subject:  s.subject,
                              score:    s.score,
                              feedback: s.feedback
                            })
                          }
                        >
                          Edit
                        </button>
                        <button
                          className={styles.smallBtnDelete}
                          onClick={() => handleDelete(s._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}
