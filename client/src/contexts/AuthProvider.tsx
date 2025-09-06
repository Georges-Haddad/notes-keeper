// client/src/contexts/AuthProvider.tsx

import React, { useState, useEffect } from 'react';
import { AuthContext, type User } from './AuthContext'; // ✅ Import from new file

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      setUser({ token, userId });
    }
  }, []);

  const login = (token: string, userId: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    setUser({ token, userId });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};