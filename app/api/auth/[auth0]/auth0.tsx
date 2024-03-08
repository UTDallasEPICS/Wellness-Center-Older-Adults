import React, { useContext, createContext, useState, ReactNode } from 'react';
import { nanoid } from 'nanoid';
import { loginRedirectUrl as loginUrl, logoutRedirectUrl as logoutUrl } from './auth';

interface AuthContextType {
  loginRedirectUrl: () => Promise<string>;
  logoutRedirectUrl: (id_token: string) => Promise<string>; 
  verifyNonce: (nonce: string) => boolean;
}

interface UserProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// UserProvider wrapper
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Auth context hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a UserProvider');
  }
  return context;
};

function useProvideAuth(): AuthContextType {
  const [state, setState] = useState<Record<string, number>>({});

  const genState = (): string => {
    const nonce = nanoid();
    setState((prevState) => ({ ...prevState, [nonce]: 1 }));
    return nonce;
  };

  const loginRedirectUrl = async (): Promise<string> => {
    const nonce = genState(); // Generate nonce as before
    // Send nonce to backend
    const response = await fetch('/api/login', {
      method: 'POST', // You might need to adjust according to your setup
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nonce }),
    });
  
    const data = await response.json();
    return data.url; // Assuming your backend returns the URL
  };

  const logoutRedirectUrl = async (id_token: string): Promise<string> => {
    const nonce = genState(); // Generate nonce as before
    // Send nonce to backend
    const response = await fetch('/api/logout', {
      method: 'POST', // You might need to adjust according to your setup
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nonce }),
    });
  
    const data = await response.json();
    return data.url; // Assuming your backend returns the URL
  };

  const verifyNonce = (nonce: string): boolean => {
    if (state[nonce]) {
      setState((prevState) => {
        const newState = { ...prevState };
        delete newState[nonce];
        return newState;
      });
      return true;
    }
    return false;
  };

  return {
    loginRedirectUrl,
    logoutRedirectUrl,
    verifyNonce,
  };
}