import React from 'react';
import { Route } from 'react-router-dom';
import Header from '../components/Header';

const Layout = ({ children }) => (
  <div>
    <Header />
    <main>{children}</main>
  </div>
);

const LayoutRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  );
};

export default LayoutRoute;
