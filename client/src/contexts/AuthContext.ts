// client/src/contexts/AuthContext.ts

import { createContext } from 'react';

export interface User {
  token: string;
  userId: string;
}

export interface AuthContextType {
  user: User | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
}

// ✅ Now this file ONLY exports context + types — no components
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {
    throw new Error('AuthContext: login function not implemented');
  },
  logout: () => {
    throw new Error('AuthContext: logout function not implemented');
  },
});