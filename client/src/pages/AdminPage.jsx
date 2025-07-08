import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  createScore,
  updateScore,
  deleteScore
} from '../features/scores/scoresSlice';
import { logout } from '../features/auth/authSlice';
import styles from './AdminPage.module.css';

export default function AdminPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [students, setStudents]           = useState([]);
  const [scoreData, setScoreData]         = useState({
    id: '',           // <-- for updates
    student: '',
    subject: '',
    score: '',
    feedback: '',
  });
  const [studentScores, setStudentScores] = useState([]);
  const [message, setMessage]             = useState({ type:'', text:'' });

  useEffect(() => {
    api.get('/users', { params:{ role:'student' }})
      .then(r => setStudents(r.data))
      .catch(() => setMessage({ type:'error', text:'Could not load students.' }));
  }, []);

  useEffect(() => {
    if (!scoreData.student) {
      setStudentScores([]);
      return;
    }
    api.get('/scores', {
      params:{ studentId: scoreData.student, page:1, limit:100 }
    })
      .then(r => setStudentScores(r.data.docs))
      .catch(() => setMessage({ type:'error', text:'Could not load scores.' }));
  }, [scoreData.student]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSubmit = async () => {
    // validation
    if (!scoreData.student || !scoreData.subject.trim() || scoreData.score === '') {
      return setMessage({ type:'error', text:'Please fill in all required fields.' });
    }
    setMessage({ type:'', text:'' });

    try {
      if (scoreData.id) {
        // update existing
        await dispatch(updateScore({
          id: scoreData.id,
          subject: scoreData.subject,
          score: scoreData.score,
          feedback: scoreData.feedback
        })).unwrap();
        setMessage({ type:'success', text:'Score updated!' });
      } else {
        // create new
        await dispatch(createScore(scoreData)).unwrap();
        setMessage({ type:'success', text:'Score added!' });
      }
      // clear form (but keep student)
      setScoreData(d => ({
        ...d,
        id: '',
        subject: '',
        score: '',
        feedback: ''
      }));
      // refresh
      const r = await api.get('/scores', {
        params:{ studentId: scoreData.student, page:1, limit:100 }
      });
      setStudentScores(r.data.docs);
    } catch (err) {
      setMessage({ type:'error', text: err.message });
    }
  };

  // form valid only when student, subject, and score are filled
  const isFormValid =
    Boolean(scoreData.student) &&
    Boolean(scoreData.subject.trim()) &&
    scoreData.score !== '';

  return (
    <div className={styles.container}>
      <button className={styles.logout} onClick={handleLogout}>
        Logout
      </button>

      <h1 className={styles.heading}>Student Score Manager</h1>

      {/* 1) Student selector */}
      <div className={styles.card}>
        <label className={styles.label}>
          Choose Student <span className={styles.required}>*</span>
        </label>
        <select
          className={styles.input}
          value={scoreData.student}
          onChange={e => {
            setMessage({ type:'', text:'' });
            setScoreData(d => ({ ...d, student:e.target.value }));
          }}
        >
          <option value="">— select student —</option>
          {students.map(s => (
            <option key={s._id} value={s._id}>
              {s.name} – {s.email}
            </option>
          ))}
        </select>
      </div>

      {scoreData.student && (
        <>
          {/* 2) Record / Update Score */}
          <div className={styles.card}>
            <h2 className={styles.subheading}>
              {scoreData.id ? 'Edit Score' : 'Record Score'}
            </h2>
            {message.text && (
              <div
                className={
                  message.type==='error' ? styles.error : styles.success
                }
              >
                {message.text}
              </div>
            )}

            <label className={styles.label}>
              Subject <span className={styles.required}>*</span>
            </label>
            <input
              className={styles.input}
              placeholder="e.g. Mathematics"
              value={scoreData.subject}
              onChange={e =>
                setScoreData(d => ({ ...d, subject: e.target.value }))
              }
            />

            <label className={styles.label}>
              Score <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              min="0" max="100"
              className={styles.input}
              placeholder="0–100"
              value={scoreData.score}
              onChange={e =>
                setScoreData(d => ({ ...d, score: e.target.value }))
              }
            />

            <label className={styles.label}>Feedback</label>
            <textarea
              className={styles.input}
              rows="3"
              placeholder="Optional comments"
              value={scoreData.feedback}
              onChange={e =>
                setScoreData(d => ({ ...d, feedback: e.target.value }))
              }
            />

            <button
              className={styles.submit}
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              {scoreData.id ? 'Update Score' : 'Add Score'}
            </button>
          </div>

          {/* 3) List of Scores */}
          <div className={styles.card}>
            <h2 className={styles.subheading}>
              Scores for{' '}
              {students.find(s => s._id === scoreData.student)?.name}
            </h2>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Feedback</th>
                    <th>Date</th>
                    <th>Actions</th> {/* <-- new header */}
                  </tr>
                </thead>
                <tbody>
                {studentScores.map(s => (
                    <tr key={s._id}>
                    <td>{s.subject}</td>
                    <td>{s.score}</td>
                    <td>{s.feedback}</td>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td>
                        <button
                        className={styles.smallBtn}
                        onClick={() => {
                            setScoreData({
                            id: s._id,
                            student: scoreData.student,
                            subject: s.subject,
                            score: s.score,
                            feedback: s.feedback
                            });
                        }}
                        >
                        Edit
                        </button>
                        <button
                        className={styles.smallBtnDelete}
                        onClick={async () => {
                            setMessage({ type: '', text: '' });
                            try {
                            await dispatch(deleteScore(s._id)).unwrap();
                            setStudentScores(curr => curr.filter(item => item._id !== s._id));
                            setMessage({ type: 'success', text: 'Score deleted.' });
                            if (scoreData.id === s._id) {
                                setScoreData(d => ({ ...d, id: '', subject:'', score:'', feedback:'' }));
                            }
                            } catch (err) {
                            setMessage({ type: 'error', text: err.message });
                            }
                        }}
                        >
                        Delete
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
