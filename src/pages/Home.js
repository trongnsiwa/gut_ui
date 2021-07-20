import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Role } from '../constants/Role';

const Home = () => {
  const { user: currentUser } = useSelector((state) => state.authReducer);

  if (currentUser && currentUser.roles?.includes(Role.ADMIN)) {
    return <Redirect to='/admin' />;
  }

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

export default Home;
