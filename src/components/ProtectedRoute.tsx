import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import useUser from '../contexts/UserContext';

interface PrivateRouteProps {
  children?: React.ReactNode;
  [key: string]: any;
}

export default function PrivateRoute({ children, ...rest }: PrivateRouteProps) {
  const { user, isLoading } = useUser();
  if (isLoading) return null;
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
