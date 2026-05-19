import { Film, LayoutDashboard, ShieldCheck, LogOut, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

type View = 'home' | 'auth' | 'dashboard' | 'admin';

interface NavbarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export default function Navbar({ currentView, onNavigate }: NavbarProps) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    onNavigate('home');
    setMenuOpen(false);
  }

  function nav(view: View) {
    onNavigate(view);
    setMenuOpen(false);
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => nav('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center group-hover:bg-amber-400 transition-colors">
              <Film size={18} className="text-gray-950" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Cine<span className="text-amber-400">Vista</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavBtn active={currentView === 'home'} onClick={() => nav('home')}>
              Home
            </NavBtn>
            {user && user.role === 'user' && (
              <NavBtn active={currentView === 'dashboard'} onClick={() => nav('dashboard')}>
                <LayoutDashboard size={15} />
                My Tickets
              </NavBtn>
            )}
            {user && user.role === 'admin' && (
              <NavBtn active={currentView === 'admin'} onClick={() => nav('admin')}>
                <ShieldCheck size={15} />
                Admin
              </NavBtn>
            )}
            {user ? (
              <div className="flex items-center gap-3 ml-2 pl-3 border-l border-gray-700">
                <span className="text-gray-400 text-sm">
                  Hi, <span className="text-white font-medium">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 text-sm transition-colors"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => nav('auth')}
                className="ml-2 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
              >
                <LogIn size={14} />
                Sign in
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-950 border-t border-gray-800 px-4 pb-4 pt-2 space-y-1">
          <MobileNavBtn active={currentView === 'home'} onClick={() => nav('home')}>Home</MobileNavBtn>
          {user && user.role === 'user' && (
            <MobileNavBtn active={currentView === 'dashboard'} onClick={() => nav('dashboard')}>
              My Tickets
            </MobileNavBtn>
          )}
          {user && user.role === 'admin' && (
            <MobileNavBtn active={currentView === 'admin'} onClick={() => nav('admin')}>
              Admin Dashboard
            </MobileNavBtn>
          )}
          {user ? (
            <>
              <p className="text-gray-500 text-xs pt-2 px-2">Signed in as {user.email}</p>
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-400 text-sm px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => nav('auth')}
              className="w-full text-left text-amber-400 text-sm px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Sign in / Sign up
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

function NavBtn({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-gray-800 text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
      }`}
    >
      {children}
    </button>
  );
}

function MobileNavBtn({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
      }`}
    >
      {children}
    </button>
  );
}
