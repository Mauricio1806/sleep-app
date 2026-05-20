import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId } from '../utils/dateHelpers';

// TODO-AWS: Plugar Amazon Cognito aqui após configuração do User Pool

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: true,
  userId: '',
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('@sleepapp:user_id').then(id => {
      if (id) {
        setUserId(id);
      } else {
        const newId = generateId();
        setUserId(newId);
        AsyncStorage.setItem('@sleepapp:user_id', newId);
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: true, userId, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
