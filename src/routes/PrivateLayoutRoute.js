import React, { useState } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { Role } from '../constants/Role';

import AdminHeader from '../components/AdminHeader';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const UserLayout = ({ children }) => (
  <div className='font-montse h-screen'>
    <Header />
    <main
      style={{
        paddingTop: '80px',
        backgroundImage: `url('https://ik.imagekit.io/tnyyngwxvx9/antoine-transon-3CIN7OxIABo-unsplash_o7KpvJvpn.jpg?updatedAt=1627830801050')`,
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
      }}
    >
      {children}
      <Footer />
    </main>
  </div>
);

const UserNoLayout = ({ children }) => (
  <div className='font-montse h-screen'>
    <Header />
    <main
      style={{
        paddingTop: '80px',
      }}
      className='bg-gradient-to-tr from-brand to-brand-light'
    >
      {children}
      <Footer />
    </main>
  </div>
);

const AdminLayout = ({ children }) => {
  const [openSidebar, setOpenSidebar] = useState(true);

  return (
    <div className='flex flex-row relative'>
      <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      <main className='w-full overflow-y-auto h-screen bg-gray-50 text-gray-900 absolute sm:sticky'>
        <AdminHeader setOpenSidebar={setOpenSidebar} openSidebar={openSidebar} />
        {children}
      </main>
    </div>
  );
};

const PrivateLayoutRoute = ({ component: Component, currentUser, roles, noBackground, ...rest }) => (
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

      if (noBackground) {
        return (
          <UserNoLayout>
            <Component {...props} />
          </UserNoLayout>
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
