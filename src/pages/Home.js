import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { hideLoader } from '../actions/LoaderAction';
import { Role } from '../constants/Role';

const Home = () => {
  const { user: currentUser } = useSelector((state) => state.authReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  dispatch(hideLoader);

  if (currentUser && currentUser.roles?.includes(Role.ADMIN)) {
    history.push('/admin');
    window.location.reload();
  }

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

export default Home;
