import { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin } from './api';
import type { LoginResponse } from './api';

interface AuthContextValue {
  user: LoginResponse['user'] | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const parsed = JSON.parse(stored) as { user: LoginResponse['user']; token: string };
      setUser(parsed.user);
      setToken(parsed.token);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const data = await apiLogin(username, password);
    setUser(data.user);
    setToken(data.access_token);
    localStorage.setItem('auth', JSON.stringify({ user: data.user, token: data.access_token }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
