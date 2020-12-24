import React, { lazy, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import getTheme from './themes/theme';
import Loader from './components/Loader';

//Routes
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import { useDispatch } from 'react-redux';
import { fetchUser } from './redux/users/userSlice';

const ServerPage = lazy(
  () => import(/* webpackChunkName: "server-page" */ './pages/ServerPage')
);

const DashboardPage = lazy(
  () => import(/* webpackChunkName: "dashboard-page" */ './pages/DashboardPage')
);

const ProfilePage = lazy(
  () => import(/* webpackChunkName: "profile-page" */ './pages/ProfilePage')
);

const theme = getTheme();

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
    // eslint-disable-next-line
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <React.Suspense fallback={<Loader />}>
        <Router>
          <Switch>
            <Route exact path='/' component={HomePage} />
            <ProtectedRoute path='/servers'>
              <ServerPage />
            </ProtectedRoute>
            <ProtectedRoute path='/dashboard'>
              <DashboardPage />
            </ProtectedRoute>
            <ProtectedRoute path='/profile'>
              <ProfilePage />
            </ProtectedRoute>
            <Route path='*' component={HomePage} />
          </Switch>
        </Router>
      </React.Suspense>
    </ThemeProvider>
  );
}

export default App;
