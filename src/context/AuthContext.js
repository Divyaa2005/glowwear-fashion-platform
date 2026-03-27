import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('glowwear_user');
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('glowwear_users') || '[]');
    const exists = users.find(u => u.email === email);
    if (exists) throw new Error('Email already registered!');
    const newUser = { name, email, password, wishlist: [], createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('glowwear_users', JSON.stringify(users));
    localStorage.setItem('glowwear_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('glowwear_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password!');
    localStorage.setItem('glowwear_user', JSON.stringify(found));
    setUser(found);
  };

  const logout = () => {
    localStorage.removeItem('glowwear_user');
    setUser(null);
  };

  const toggleWishlist = (productId) => {
    if (!user) return;
    const users = JSON.parse(localStorage.getItem('glowwear_users') || '[]');
    const idx = users.findIndex(u => u.email === user.email);
    if (idx === -1) return;
    const wishlist = users[idx].wishlist || [];
    const already = wishlist.includes(productId);
    users[idx].wishlist = already ? wishlist.filter(id => id !== productId) : [...wishlist, productId];
    localStorage.setItem('glowwear_users', JSON.stringify(users));
    localStorage.setItem('glowwear_user', JSON.stringify(users[idx]));
    setUser(users[idx]);
  };

  const isWishlisted = (productId) => user?.wishlist?.includes(productId) || false;

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, toggleWishlist, isWishlisted }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};