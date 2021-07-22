import React, { useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Role } from '../constants/Role';

const UserLayout = ({ children }) => (
  <div>
    <Header />
    <main>{children}</main>
  </div>
);

const AdminLayout = ({ children }) => {
  const [openSidebar, setOpenSidebar] = useState(true);

  return (
    <div className='flex flex-row relative'>
      <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      <main className={`w-full overflow-y-auto h-screen bg-gray-50 text-gray-900 absolute sm:sticky`}>
        <AdminHeader setOpenSidebar={setOpenSidebar} openSidebar={openSidebar} />
        {children}
      </main>
    </div>
  );
};

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
