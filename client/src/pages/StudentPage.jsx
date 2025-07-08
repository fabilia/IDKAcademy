// src/pages/StudentPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchScores } from '../features/scores/scoresSlice';
import { logout } from '../features/auth/authSlice';
import Pagination from '../components/Pagination';
import styles from './StudentPage.module.css';

export default function StudentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const { list, pageInfo, status, error } = useSelector(s => s.scores);

  // load first page on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchScores({ studentId: user.id, page: 1, limit: 5 }));
    }
  }, [dispatch, user]);

  const handlePage = page => {
    dispatch(fetchScores({ studentId: user.id, page, limit: 5 }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/', { replace: true });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Your Scores</h2>
          <button className={styles.logout} onClick={handleLogout}>
            Logout
          </button>
        </div>

        {status === 'loading' && <p>Loading…</p>}
        {error && <div className={styles.error}>{error}</div>}

        {list.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Score</th>
                  <th>Feedback</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {list.map(s => (
                  <tr key={s._id}>
                    <td>{s.subject}</td>
                    <td>{s.score}</td>
                    <td>{s.feedback}</td>
                    <td>
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No scores found.</p>
        )}

        {pageInfo.totalPages > 1 && (
          <Pagination pageInfo={pageInfo} onPage={handlePage} />
        )}
      </div>
    </div>
  );
}
