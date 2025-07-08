import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ChooseRole() {
  const [role, setRole] = useState('student');
  const user    = useSelector(s => s.auth.user);
  const navigate= useNavigate();

  const handleSave = async () => {
    await api.put(`/users/${user.id}/role`, { role });
    navigate(role === 'admin' ? '/admin' : '/student');
  };

  return (
    <div style={{maxWidth:360,margin:'2rem auto',textAlign:'center'}}>
      <h2>Welcome, {user.name}</h2>
      <p>Select account type:</p>
      <select value={role} onChange={e=>setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={handleSave} style={{marginTop:'1rem'}}>Continue</button>
    </div>
  );
}
