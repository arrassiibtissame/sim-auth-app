import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../models';
import { userRepository } from '../database/repositories';
import DatabaseService from '../database/DatabaseService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      await DatabaseService.initializeDatabase();
      
      // Check if database is empty and seed with sample data for development
      const result = await DatabaseService.executeQuery('SELECT COUNT(*) as count FROM users');
      if (result[0].count === 0) {
        console.log('Database is empty, seeding with sample data...');
        const { seedDatabase } = await import('../utils/seedDatabase');
        await seedDatabase();
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      setIsLoading(false);
    }
  };

  const login = async (username: string): Promise<boolean> => {
    try {
      const authenticatedUser = await userRepository.authenticateUser(username);
      if (authenticatedUser) {
        setUser(authenticatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
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