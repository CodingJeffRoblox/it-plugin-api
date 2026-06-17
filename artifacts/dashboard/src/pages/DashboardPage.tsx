import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customFetch } from '@workspace/api-client-react';
import { useAuthStore } from '../lib/auth';

interface Summary {
  openTickets: number;
  errors: number;
  totalEvents: number;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await customFetch('/api/dashboard/summary');
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-xl font-bold">ITPlugin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm mb-2">Open Tickets</h3>
            <p className="text-3xl font-bold">{summary?.openTickets || 0}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm mb-2">Errors</h3>
            <p className="text-3xl font-bold text-red-400">{summary?.errors || 0}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm mb-2">Total Events</h3>
            <p className="text-3xl font-bold">{summary?.totalEvents || 0}</p>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <p className="text-slate-400">Activity feed coming soon...</p>
        </div>
      </main>
    </div>
  );
}
