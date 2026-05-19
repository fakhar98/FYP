import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

type View = 'home' | 'auth' | 'dashboard' | 'admin';

function AppInner() {
  const { user } = useAuth();
  const [view, setView] = useState<View>('home');

  function navigate(v: View) {
    if (v === 'dashboard' && !user) { setView('auth'); return; }
    if (v === 'admin' && user?.role !== 'admin') { setView('home'); return; }
    setView(v);
  }

  function renderView() {
    if (view === 'auth') {
      return (
        <AuthPage
          onSuccess={() => {
            // Re-read user from session after auth
            const raw = sessionStorage.getItem('cinevista_session');
            const u = raw ? JSON.parse(raw) : null;
            navigate(u?.role === 'admin' ? 'admin' : 'home');
          }}
        />
      );
    }
    if (view === 'dashboard' && user?.role === 'user') {
      return <UserDashboard onNavigate={navigate} />;
    }
    if (view === 'admin' && user?.role === 'admin') {
      return <AdminDashboard />;
    }
    return <HomePage onNavigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar currentView={view} onNavigate={navigate} />
      {renderView()}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
