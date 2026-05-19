import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { getUserByEmail, createUser } from '../lib/storage';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => string | null;
  signup: (name: string, email: string, password: string) => string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = 'cinevista_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else sessionStorage.removeItem(SESSION_KEY);
  }, [user]);

  function login(email: string, password: string): string | null {
    const found = getUserByEmail(email);
    if (!found) return 'No account found with that email.';
    if (found.password !== password) return 'Incorrect password.';
    setUser(found);
    return null;
  }

  function signup(name: string, email: string, password: string): string | null {
    if (getUserByEmail(email)) return 'An account with that email already exists.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    const newUser = createUser({ name, email, password });
    setUser(newUser);
    return null;
  }

  function logout() {
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
