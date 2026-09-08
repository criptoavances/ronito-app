'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const response = await api.auth.getCurrentUser();
    if (response.data && typeof response.data === 'object' && 'id' in response.data) {
      setUser(response.data as User);
    } else {
      localStorage.removeItem('token');
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const response = await api.auth.login(email, password);
    if (response.data && typeof response.data === 'object') {
      const data = response.data as any;
      localStorage.setItem('token', data.access_token || '');
      setUser({ id: data.user_id, email: data.email } as User);
    } else {
      throw new Error(response.error || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
