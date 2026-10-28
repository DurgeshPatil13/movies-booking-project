import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentUser,
  setCurrentUser,
  loginUser,
  registerUser,
  updateUserProfile,
  logoutUser,
  resetDemoData,
  initialUsers
} from '../services/storage.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = getCurrentUser();
    setUser(existing);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const loggedUser = loginUser(email, password);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (userData) => {
    const newUser = registerUser(userData);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const updateProfile = (updates) => {
    if (!user) return;
    const updated = updateUserProfile(user.id, updates);
    setUser({ ...updated });
    return updated;
  };

  const switchDemoAccount = (role) => {
    const target = initialUsers.find(u => u.role === role) || initialUsers[0];
    setCurrentUser(target);
    setUser(target);
    return target;
  };

  const resetAllData = () => {
    resetDemoData();
    const refreshed = getCurrentUser();
    setUser(refreshed);
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    switchDemoAccount,
    resetAllData,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
