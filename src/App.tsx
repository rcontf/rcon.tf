import React, { lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { CircularProgress, CssBaseline, Box } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import getTheme from './themes/theme';
import { AuthProvider } from './contexts/UserContext';

//Routes
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layouts/Layout';

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
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <React.Suspense
            fallback={
              <Layout>
                <Box
                  display='flex'
                  justifyContent='center'
                  alignItems='center'
                  height='70vh'
                >
                  <CircularProgress size={100} />
                </Box>
              </Layout>
            }
          >
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
          </React.Suspense>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
