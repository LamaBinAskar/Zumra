import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, Mentor, UserRole } from '../types';
import { MOCK_USERS, MOCK_MENTORS } from '../mockData';

const SESSION_KEY = 'zumra_session_role';

interface AuthContextType {
  currentUser: User | Mentor | null;
  isLoading: boolean;
  sessionLoaded: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void; // demo helper
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_ADMIN: User = {
  id: 'admin1',
  name: 'د. أحمد الأحمدي',
  email: 'admin@uni.edu.sa',
  role: 'admin',
  university: 'جامعة الملك عبدالعزيز',
  college: 'وحدة الإرشاد الأكاديمي',
  major: 'إدارة التعليم',
  year: 0,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin&backgroundColor=c0aede',
  points: 0,
  badges: [],
  joinedAt: '2023-01-01',
};

function userForRole(role: UserRole): User | Mentor {
  if (role === 'admin')  return DEMO_ADMIN;
  if (role === 'mentor') return MOCK_MENTORS[0];
  return MOCK_USERS[0];
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | Mentor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  /* Restore session from localStorage on first mount */
  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY) as UserRole | null;
    if (saved) setCurrentUser(userForRole(saved));
    setSessionLoaded(true);
  }, []);

  const login = useCallback(async (email: string, _password: string, role: UserRole) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    localStorage.setItem(SESSION_KEY, role);
    setCurrentUser(userForRole(role));
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
  }, []);

  // Demo helper to quickly switch between roles
  const switchRole = useCallback((role: UserRole) => {
    if (role === 'admin') setCurrentUser(DEMO_ADMIN);
    else if (role === 'mentor') setCurrentUser(MOCK_MENTORS[0]);
    else setCurrentUser(MOCK_USERS[0]);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, sessionLoaded, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
