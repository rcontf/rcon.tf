import React, { lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import getTheme from './themes/theme';
import './App.css';

//Routes
import HomePage from './pages/HomePage';
import ProtectedRoute from "./components/ProtectedRoute";

const TestPage = lazy(
  () => import(/* webpackChunkName: "test-page" */ './pages/TestPage')
);

const SuccessPage = lazy(
  () => import(/* webpackChunkName: "test-page" */ './pages/AuthSuccess')
);

const DashboardPage = lazy(
  () => import(/* webpackChunkName: "test-page" */ './pages/DashboardPage')
);

const theme = getTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <React.Suspense fallback={<span>Loading</span>}>
        <Router>
          <Switch>
            <Route exact path='/' component={HomePage} />
            <Route path='/test' component={TestPage} />
            <Route path='/success' component={SuccessPage} />
            <ProtectedRoute path="/dashboard">
                <DashboardPage />
            </ProtectedRoute>
            <Route path='*' component={HomePage} />
          </Switch>
        </Router>
      </React.Suspense>
    </ThemeProvider>
  );
}

export default App;
