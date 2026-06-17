import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customFetch } from '@workspace/api-client-react';
import { useAuthStore } from '../lib/auth';

export default function LoginPage() {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setApiKey = useAuthStore((state) => state.setApiKey);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await customFetch('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ apiKey: key }),
      });

      const data = await res.json();

      if (data.valid) {
        localStorage.setItem('role', data.role);
        setApiKey(key);
        navigate('/');
      } else {
        setError('Invalid API key');
      }
    } catch (err) {
      setError('Failed to verify API key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">ITPlugin Dashboard</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium mb-2">
              API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your API key"
              required
            />
          </div>
          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Verifying...' : 'Connect'}
          </button>
        </form>
      </div>
    </div>
  );
}
