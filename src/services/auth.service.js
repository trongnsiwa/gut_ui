import { post } from '../helpers/httpHelper';

const API_URL = '/auth';

export const registerService = (email, password, confirm, firstname, lastname) => {
  return post(API_URL + '/signup', {
    email,
    password,
    retypePassword: confirm,
    firstName: firstname,
    lastName: lastname,
  });
};

export const loginService = (email, password) => {
  return post(API_URL + '/login', {
    email,
    password,
  }).then((res) => {
    if (res.data.data.token) {
      localStorage.setItem('user', JSON.stringify(res.data.data));
    }

    return res.data;
  });
};

export const logoutService = () => {
  localStorage.removeItem('user');
};
