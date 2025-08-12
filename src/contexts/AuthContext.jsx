import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get('/check_session');
      if (response.data.success && response.data.data.user) {
        setUser(response.data.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log('Session check error:', error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, senha) => {
    try {
      const response = await api.post('/login', { email, senha });
      if (response.data.success) {
        // Cria objeto user com os dados retornados
        const userData = {
          id: response.data.data.user_id,
          name: response.data.data.user_name,
          type: response.data.data.user_type
        };
        setUser(userData);
        return { success: true, redirect: response.data.data.redirect };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao fazer login' 
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/register', userData);
      if (response.data.success) {
        // Cria objeto user com os dados retornados
        const userInfo = {
          id: response.data.data.user_id,
          name: response.data.data.user_name,
          type: response.data.data.user_type
        };
        setUser(userInfo);
        return { success: true, redirect: response.data.data.redirect };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao cadastrar' 
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}