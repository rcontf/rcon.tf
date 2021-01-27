import React, { useContext, useEffect, useState } from 'react';
import { UserData } from '../redux/users/types';
import { getUserInfo } from '../redux/users/userApi';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface User {
  user: UserData | null;
}

const AuthContext = React.createContext<User>({ user: null });

export const useAuth = () => useContext(AuthContext);
export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User>({ user: null });

  useEffect(() => {
    getUserInfo()
      .then(user => setCurrentUser({ ...currentUser, user }))
      .catch(() => setCurrentUser({ user: null }));
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  );
}

export default useAuth;
