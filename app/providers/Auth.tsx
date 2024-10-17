'use client';

import React, { useContext, useState, useEffect, createContext, ReactNode } from 'react';

interface AuthContextType {}

interface UserProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// UserProvider wrapper intended to wrap the entire website
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Auth context hook, mainly used to import Auth provider functions
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a UserProvider');
  }
  return context;
};

// Define authentication related functions  and values here
function useProvideAuth(): AuthContextType {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Under the assumption that the middleware already validated any existing cvtoken:
  // Marks the user as authenticated if the cvtoken exists and is not blank.
  const checkSession = () => {
    const fetchAuthStatus = async () => {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      setIsAuthenticated(data.isAuthenticated);
    };
    fetchAuthStatus();
  };

  // Redirects user to login page
  const handleLogin = async () => {
    try {
      const response = await fetch('/api/auth/login');
      if (!response.ok) {
        throw new Error('Failed to fetch login URL');
      }

      // Extract the URL from the response
      const data = await response.json();
      const { url } = data;
      window.location.href = url;
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  // Any call to this function will log the user out of their account
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout');
      if (!response.ok) {
        throw new Error('Failed to fetch logout URL');
      }
      const data = await response.json();
      const { url } = data;
      setIsAuthenticated(false);
      window.location.href = url;
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Check session on component mount
  useEffect(() => {
    checkSession();
  }, []);

  // Return any functions or values here which need to be made public
  // access to components using useAuth()
  return {
    isAuthenticated,
    handleLogin,
    handleLogout,
  };
}
