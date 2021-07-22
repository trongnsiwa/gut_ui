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
import Signup from './pages/Signup';
import AdminDashBoard from './pages/AdminDashBoard';
import NotFound from './pages/NotFound';
import Category from './pages/Category';
import Loader from './components/Loader';
import CategoryDetail from './pages/CategoryDetail';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

function App() {
  const { user: currentUser } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  toast.configure();

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);

  return (
    <>
      <Router history={history}>
        <Switch>
          <PrivateLayoutRoute
            exact
            path='/admin'
            currentUser={currentUser}
            roles={[Role.ADMIN]}
            component={AdminDashBoard}
          />
          <PrivateLayoutRoute
            exact
            path='/admin/category'
            currentUser={currentUser}
            roles={[Role.ADMIN]}
            component={Category}
          />
          <PrivateLayoutRoute
            exact
            path='/admin/category/:id'
            currentUser={currentUser}
            roles={[Role.ADMIN]}
            component={CategoryDetail}
          />
          <LayoutRoute exact path={'/'} component={Home} />
          <LayoutRoute exact path='/signin' component={Signin} />
          <LayoutRoute exace path='/signup' component={Signup} />
          <LayoutRoute component={NotFound} />
        </Switch>
      </Router>
      <Loader />
      <ToastContainer />
    </>
  );
}

export default App;
