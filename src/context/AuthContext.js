import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('glowwear_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        localStorage.removeItem('glowwear_token');
        setUser(null);
      }
    } catch (err) {
      localStorage.removeItem('glowwear_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.token) {
      localStorage.setItem('glowwear_token', res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await api.register(name, email, password);
    if (res.token) {
      localStorage.setItem('glowwear_token', res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('glowwear_token');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const res = await api.updateProfile(profileData);
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  const changePassword = async (currentPassword, newPassword) => {
    return await api.changePassword(currentPassword, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        signup: register, // alias for backwards compatibility
        logout,
        updateProfile,
        changePassword,
        refreshUser: checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;