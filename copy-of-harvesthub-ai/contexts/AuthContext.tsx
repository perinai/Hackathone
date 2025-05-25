
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { mockUsers } from '../services/mockData'; // For demo
import { ROUTES } from '../constants';
import { useNavigate } from 'react-router-dom';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User | null>; // Simplified
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<User | null>;
  logout: () => void;
  updateUserContext: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate(); // Cannot use useNavigate here as AuthProvider is outside Router usually

  useEffect(() => {
    // Check for persisted user session (e.g., from localStorage)
    const storedUser = localStorage.getItem('harvestHubUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        // Ensure date fields are properly parsed if stored as strings
        parsedUser.createdAt = new Date(parsedUser.createdAt);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('harvestHubUser');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const foundUser = mockUsers.find(u => u.email === email); // Simplified: no password check

    if (foundUser) {
      const loggedInUser = { ...foundUser, createdAt: new Date(foundUser.createdAt) };
      setUser(loggedInUser);
      localStorage.setItem('harvestHubUser', JSON.stringify(loggedInUser));
      setLoading(false);
      return loggedInUser;
    }
    setLoading(false);
    return null;
  }, []);

  const register = useCallback(async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User | null> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      setLoading(false);
      throw new Error("User with this email already exists.");
    }
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date(),
    };
    mockUsers.push(newUser); // Add to mock data
    setUser(newUser);
    localStorage.setItem('harvestHubUser', JSON.stringify(newUser));
    setLoading(false);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('harvestHubUser');
    // Navigation should be handled by the component calling logout
    // For example, using navigate(ROUTES.LANDING) in Navbar
  }, []);
  
  const updateUserContext = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('harvestHubUser', JSON.stringify(updatedUser));
  }, []);


  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
    