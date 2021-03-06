import React, { useContext, useEffect, useState } from 'react';
import { UserData } from '../redux/users/types';
import { getUserInfo } from '../redux/users/userApi';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface User {
  user: UserData | null;
  isLoading: boolean;
}

const AuthContext = React.createContext<User>({ user: null, isLoading: true });

export const useAuth = () => useContext(AuthContext);
export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    getUserInfo()
      .then(user => setCurrentUser({ ...currentUser, user, isLoading: false }))
      .catch(() => setCurrentUser({ user: null, isLoading: false }));
      // Including the current user would result in INFINITY LOOP!!
      // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  );
}

export default useAuth;
