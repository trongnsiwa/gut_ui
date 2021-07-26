import { getWithParams } from '../helpers/httpHelper';

const API_URL = '/home';

export const getNewProducts = (size) => {
  return getWithParams(API_URL + '/new', {
    size,
  });
};

export const getSaleProducts = (size) => {
  return getWithParams(API_URL + '/sale', {
    size,
  });
};
