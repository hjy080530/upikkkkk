'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_CURRENT_USER } from '../graphql/queries';
import { User } from '../types/api';
import { getAccessToken, removeAccessToken } from '../lib/auth-utils';

interface CurrentUserData {
  iam: {
    getCurrentUser: User;
  };
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  refetchUser: async () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { data, loading: queryLoading, error: queryError, refetch } = useQuery<CurrentUserData>(GET_CURRENT_USER, {
    skip: !token,
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore'
  });

  console.log('🚀 useUser 상태:', { token, queryLoading, data, queryError });
  
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedToken = getAccessToken();
    console.log('🔑 저장된 토큰:', savedToken);
    if (savedToken) {
      setToken(savedToken);
    } else {
      console.log('❌ 토큰이 없습니다');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('📡 useQuery 응답 데이터:', data);
    if (data?.iam?.getCurrentUser) {
      console.log('✅ 사용자 정보 찾음:', data.iam.getCurrentUser);
      setUser(data.iam.getCurrentUser);
    } else {
      console.log('❌ 사용자 정보 없음, data 구조:', data);
    }
    if (queryError) {
      console.error('🔥 사용자 정보 조회 에러:', queryError);
      if (queryError.message.includes('401') || queryError.message.includes('Unauthorized')) {
        logout();
      }
    }
    if (!queryLoading && token) {
      setLoading(false);
    }
  }, [data, queryError, queryLoading, token]);

  const login = async () => {
    try {
      setLoading(true);
      await refetch();
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAccessToken();
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const refetchUser = async () => {
    try {
      const { data } = await refetch();
      if (data?.iam?.getCurrentUser) {
        setUser(data.iam.getCurrentUser);
      }
    } catch {
      // Error handling if needed
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      error: queryError || null, 
      login,
      logout,
      isAuthenticated: !!user,
      refetchUser 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
