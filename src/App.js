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
import AdminDashBoard from './pages/Admin/AdminDashBoard';
import NotFound from './pages/NotFound';
import Category from './pages/Admin/Category/Category';
import Loader from './components/Loader';
import CategoryDetail from './pages/Admin/Category/CategoryDetail';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import CreateCategory from './pages/Admin/Category/CreateCategory';
import Color from './pages/Admin/Color/Color';
import ColorDetail from './pages/Admin/Color/ColorDetail';
import Product from './pages/Admin/Product/Product';
import ProductDetail from './pages/Admin/Product/ProductDetail';
import CreateProduct from './pages/Admin/Product/CreateProduct';
import ImageUpload from './pages/Admin/Product/ImageUpload';
import UserCategory from './pages/NormalUser/UserCategory';

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
          <PrivateLayoutRoute
            exact
            path='/admin/create-category'
            currentUser={currentUser}
            roles={[Role.ADMIN]}
            component={CreateCategory}
          />
          <PrivateLayoutRoute
            exact
            path='/admin/color'
            currentUser={currentUser}
            roles={[Role.ADMIN]}
            component={Color}
          />
          <PrivateLayoutRoute
            exact
            path='/admin/color/:id'
            currentUser={currentUser}
            roles={[Role.ADMIN]}
            component={ColorDetail}
          />
          <PrivateLayoutRoute
            exact
            path='/admin/product'
            currentUser={currentUser}
            roles={[Role.ADMIN]}
            component={Product}
          />
          <PrivateLayoutRoute
            exact
            path='/admin/product/:id'
            currentUser={currentUser}
            roles={[Role.ADMIN]}
            component={ProductDetail}
          />
          <PrivateLayoutRoute
            exact
            path='/admin/create-product'
            currentUser={currentUser}
            roles={[Role.ADMIN]}
            component={CreateProduct}
          />
          <PrivateLayoutRoute
            exact
            path='/admin/product/:id/image'
            currentUser={currentUser}
            roles={[Role.ADMIN]}
            component={ImageUpload}
          />
          <LayoutRoute exact path={'/'} component={Home} />
          <LayoutRoute exact path='/signin' component={Signin} />
          <LayoutRoute exact path='/signup' component={Signup} />
          <LayoutRoute exact path='/category/:parent/:slug' component={UserCategory} />
          <LayoutRoute exact path='/category/:parent' component={UserCategory} />
          <LayoutRoute component={NotFound} />
        </Switch>
      </Router>
      <Loader />
      <ToastContainer />
    </>
  );
}

export default App;
