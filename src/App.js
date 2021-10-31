import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Router, Switch } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { history } from './helpers/history';

import { LoginLayoutRoute, LayoutRoute } from './routes/LayoutRoute';
import PrivateLayoutRoute from './routes/PrivateLayoutRoute';

import { clearMessage } from './actions/MessageAction';

import { Role } from './constants/Role';

import Loader from './components/Loader';

import Signin from './pages/Signin';
import Signup from './pages/Signup';

import NotFound from './pages/NotFound';

import Home from './pages/Home';
import AdminDashBoard from './pages/Admin/AdminDashBoard';

import Category from './pages/Admin/Category/Category';
import CategoryDetail from './pages/Admin/Category/CategoryDetail';
import CreateCategory from './pages/Admin/Category/CreateCategory';

import Color from './pages/Admin/Color/Color';
import ColorDetail from './pages/Admin/Color/ColorDetail';

import Product from './pages/Admin/Product/Product';
import ProductDetail from './pages/Admin/Product/ProductDetail';
import CreateProduct from './pages/Admin/Product/CreateProduct';
import ImageUpload from './pages/Admin/Product/ImageUpload';

import UserCategory from './pages/NormalUser/UserCategory';
import ItemDetail from './pages/NormalUser/ItemDetail';
import Cart from './pages/NormalUser/Cart';

import tawkTo from 'tawkto-react';
import Payment from './pages/NormalUser/Payment';
import FinishOrder from './pages/NormalUser/FinishOrder';
import Profile from './pages/NormalUser/Profile';
import Purchase from './pages/NormalUser/Purchase';
import PurchaseDetail from './pages/NormalUser/PurchaseDetail';
import Ranking from './pages/Ranking';

function App() {
  const { user: currentUser } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  const tawkToPropertyId = '61702a50f7c0440a591f2d30';
  const tawkToKey = '2c5d95d4334ed876b6d8c0dc19bc6ab4ee501167';

  toast.configure();

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage());
    });
  }, [dispatch]);

  useEffect(() => {
    tawkTo(tawkToPropertyId, tawkToKey);
    var Tawk_API = Tawk_API || {},
      Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement('script'),
        s0 = document.getElementsByTagName('script')[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/61702a50f7c0440a591f2d30/1fif2aisp';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  }, []);

  return (
    <>
      <Router history={history}>
        <Switch>
          <LayoutRoute exact path='/' component={Home} />

          <LoginLayoutRoute exact path='/signin' component={Signin} />
          <LoginLayoutRoute exact path='/signup' component={Signup} />

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

          <LayoutRoute exact path='/category/:parent/:slug' component={UserCategory} />
          <LayoutRoute exact path='/category/:parent' component={UserCategory} />
          <LayoutRoute exact path='/product/:id' component={ItemDetail} />
          <LayoutRoute exact path='/ranking' component={Ranking} />

          <PrivateLayoutRoute exact path='/cart' currentUser={currentUser} roles={[Role.USER]} component={Cart} />
          <PrivateLayoutRoute exact path='/payment' currentUser={currentUser} roles={[Role.USER]} component={Payment} />
          <PrivateLayoutRoute
            exact
            path='/order'
            currentUser={currentUser}
            roles={[Role.USER]}
            component={FinishOrder}
          />
          <PrivateLayoutRoute
            exact
            path='/user/account/profile'
            noBackground={true}
            currentUser={currentUser}
            roles={[Role.USER]}
            component={Profile}
          />
          <PrivateLayoutRoute
            exact
            path='/user/purchase'
            noBackground={true}
            currentUser={currentUser}
            roles={[Role.USER]}
            component={Purchase}
          />
          <PrivateLayoutRoute
            exact
            path='/user/purchase/:id'
            noBackground={true}
            currentUser={currentUser}
            roles={[Role.USER]}
            component={PurchaseDetail}
          />

          <LoginLayoutRoute component={NotFound} />
        </Switch>
      </Router>

      <Loader />
      <ToastContainer />
    </>
  );
}

export default App;
