import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ms_token'));
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('ms_token', token);
    } else {
      localStorage.removeItem('ms_token');
    }
  }, [token]);

  const signup = async (formData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', formData);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsNewUser(true);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Sign up failed. Please try again.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      setIsNewUser(false);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsNewUser(false);
    localStorage.removeItem('ms_token');
  };

  const selectClass = (className) => {
    if (user) {
      setUser({ ...user, class: className });
    }
  };

  const clearNewUser = () => setIsNewUser(false);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isNewUser,
      signup,
      login,
      logout,
      selectClass,
      clearNewUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
