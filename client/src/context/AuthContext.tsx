import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import API from '../services/api';

interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  googleLogin: (tokenData: { credential?: string; accessToken?: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('aura_user');
    const token = localStorage.getItem('aura_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: any) => {
    try {
      const { data } = await API.post('/auth/login', credentials);
      const userData = {
        _id: data._id,
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role
      };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('aura_user', JSON.stringify(userData));
      localStorage.setItem('aura_token', data.token);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData: any) => {
    try {
      const { data } = await API.post('/auth/register', userData);
      const userDataFormatted = {
        _id: data._id,
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role || 'customer'
      };
      setUser(userDataFormatted);
      setIsAuthenticated(true);
      localStorage.setItem('aura_user', JSON.stringify(userDataFormatted));
      localStorage.setItem('aura_token', data.token);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const googleLogin = async (tokenData: { credential?: string; accessToken?: string }) => {
    try {
      const { data } = await API.post('/auth/google', tokenData);
      const userData = {
        _id: data._id,
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role || 'customer'
      };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('aura_user', JSON.stringify(userData));
      localStorage.setItem('aura_token', data.token);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Google Login failed');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('aura_user');
    localStorage.removeItem('aura_token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, googleLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

