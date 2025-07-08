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
  const auth = useSelector(s => s.auth);
  const { list, pageInfo } = useSelector(s => s.scores);

  const load = (page = 1) =>
    dispatch(fetchScores({ studentId: auth.user.id, page, limit: 5 }));

  useEffect(() => {
    load();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <button className={styles.logout} onClick={handleLogout}>
        Logout
      </button>
      <div className={styles.card}>
        <h2 className={styles.title}>Your Scores</h2>
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
                  <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination pageInfo={pageInfo} onPage={load} />
      </div>
    </div>
  );
}
