import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Signin from './pages/Signin';
import LoginLayoutRoute from './routes/LoginLayoutRoute';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Redirect to='/signin' />
        </Route>
        <LoginLayoutRoute path='/signin' component={Signin} />
      </Switch>
    </Router>
  );
}

export default App;
