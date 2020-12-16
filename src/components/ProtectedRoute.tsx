import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { userSelector } from '../redux/users/userSlice';

interface PrivateRouteProps {
  children?: React.ReactNode;
  [key: string]: any;
}

export default function PrivateRoute({ children, ...rest }: PrivateRouteProps) {
  const user = useSelector(userSelector);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user?.id ? (
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
