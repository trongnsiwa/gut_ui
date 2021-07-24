import { del, get, getWithParams, put, post } from '../helpers/httpHelper';

const API_URL = '/color';

export const getALlColors = () => {
  return get(API_URL + '/all');
};

export const getColors = (num, size, sortBy) => {
  const params = {
    num,
    size,
    sortBy,
  };

  return getWithParams(API_URL + '/page', params);
};

export const searchByName = (num, size, sortBy, name) => {
  return getWithParams(API_URL + '/search', {
    num,
    size,
    sortBy,
    name,
  });
};

export const countColors = () => {
  return get(API_URL + '/count');
};

export const countColorsByName = (name) => {
  return getWithParams(API_URL + '/count-name', {
    name,
  });
};

export const getColor = (id) => {
  return get(API_URL + `/${id}`);
};

export const deleteColor = (id) => {
  return del(API_URL + `/${id}`);
};

export const updateColor = (id, name, source) => {
  return put(API_URL, {
    id,
    name,
    source,
  });
};

export const addColor = (name, source) => {
  return post(API_URL, {
    name,
    source,
  });
};
