import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage      from './pages/HomePage';
import OAuthHandler  from './pages/OAuthHandler';
import ChooseRole    from './pages/ChooseRole';
import AdminPage     from './pages/AdminPage';
import StudentPage   from './pages/StudentPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/oauth" element={<div>🚀 OAuthRoute Works!</div>} />
        <Route path="/oauth/*" element={<OAuthHandler />} />
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
        <Route element={<ProtectedRoute role="student" />}>
          <Route path="/student" element={<StudentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return null; // all routing now in index.js
}
