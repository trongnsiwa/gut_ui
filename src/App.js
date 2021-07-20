import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Router, Switch } from 'react-router-dom';
import Signin from './pages/Signin';
import { history } from './helpers/history';
import { clearMessage } from './actions/MessageAction';
import Home from './pages/Home';
import LayoutRoute from './routes/LayoutRoute';
import PrivateLayoutRoute from './routes/PrivateLayoutRoute';
import { Role } from './constants/Role';
import Admin from './pages/Admin';
import Signup from './pages/Signup';

function App() {
  const { user: currentUser } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);

  return (
    <Router history={history}>
      <Switch>
        <PrivateLayoutRoute path='/admin' currentUser={currentUser} roles={[Role.ADMIN]} component={Admin} />
        <LayoutRoute exact path={'/'} component={Home} />
        <LayoutRoute path='/signin' component={Signin} />
        <LayoutRoute path='/signup' component={Signup} />
      </Switch>
    </Router>
  );
}

export default App;
