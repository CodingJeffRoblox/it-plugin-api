import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { setBaseUrl } from '@workspace/api-client-react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { useAuthStore } from './lib/auth';

function App() {
  const { apiKey } = useAuthStore();

  useEffect(() => {
    if (import.meta.env.VITE_API_URL) {
      setBaseUrl(import.meta.env.VITE_API_URL);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={apiKey ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/" element={apiKey ? <DashboardPage /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
