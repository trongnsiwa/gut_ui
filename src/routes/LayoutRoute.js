import React from 'react';
import { Route } from 'react-router-dom';

import Footer from '../components/Footer';
import Header from '../components/Header';

const Layout = ({ children }) => (
  <div className='font-montse h-screen'>
    <Header />
    <main style={{ paddingTop: '80px' }}>{children}</main>
    <Footer />
  </div>
);

const LoginLayout = ({ children }) => (
  <div className='font-montse h-screen'>
    <Header />
    <main style={{ paddingTop: '80px' }}>{children}</main>
  </div>
);

export const LayoutRoute = ({ component: Component, ...rest }) => {
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

export const LoginLayoutRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <LoginLayout>
          <Component {...props} />
        </LoginLayout>
      )}
    />
  );
};
