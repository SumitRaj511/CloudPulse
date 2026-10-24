import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@cloudops.io' && password === 'admin123') {
      const userData = { id: 1, name: 'Alex Chen', email, role: 'admin', avatar: 'AC' };
      setUser(userData);
      setIsLoading(false);
      return { success: true };
    } else if (email === 'viewer@cloudops.io' && password === 'viewer123') {
      const userData = { id: 2, name: 'Sam Rivera', email, role: 'viewer', avatar: 'SR' };
      setUser(userData);
      setIsLoading(false);
      return { success: true };
    }
    
    setIsLoading(false);
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
