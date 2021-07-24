import { get } from '../helpers/httpHelper';

const API_URL = '/size';

export const getALlSizes = () => {
  return get(API_URL + '/all');
};
