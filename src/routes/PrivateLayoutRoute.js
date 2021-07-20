import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { Role } from '../constants/Role';

const UserLayout = ({ children }) => (
  <div>
    <Header />
    <main>{children}</main>
    <Loader />
  </div>
);

const AdminLayout = ({ children }) => (
  <div>
    <main>{children}</main>
    <Loader />
  </div>
);

const PrivateLayoutRoute = ({ component: Component, currentUser, roles, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (!currentUser) {
        return <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />;
      }

      if (
        roles &&
        (roles.length !== currentUser.roles.length ||
          (roles.includes(Role.ADMIN) && !currentUser.roles.includes(Role.ADMIN)))
      ) {
        return <Redirect to='/' />;
      }

      if (roles && roles.includes(Role.ADMIN)) {
        return (
          <AdminLayout>
            <Component {...props} />
          </AdminLayout>
        );
      }

      return (
        <UserLayout>
          <Component {...props} />
        </UserLayout>
      );
    }}
  />
);

export default PrivateLayoutRoute;
