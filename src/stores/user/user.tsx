'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_CURRENT_USER } from '../../graphql/queries';
import { User } from '../../types/api';

interface CurrentUserData {
  me: User;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: false,
  error: null,
  refetchUser: async () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const { data, loading, error, refetch } = useQuery<CurrentUserData>(GET_CURRENT_USER);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (data?.me) {
      setUser(data.me);
    }
  }, [data]);

  const refetchUser = async () => {
    try {
      const { data } = await refetch();
      if (data?.me) {
        setUser(data.me);
      }
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, error: error || null, refetchUser }}>
      {children}
    </UserContext.Provider>
  );
}
