import React, { lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

//Routes
import HomePage from './pages/HomePage';

const TestPage = lazy(() => import('./pages/TestPage'));

function App() {
  return (
    <React.Suspense fallback={<span>Loading</span>}>
      <Router>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/test' component={TestPage} />
        </Switch>
      </Router>
    </React.Suspense>
  );
}

export default App;
