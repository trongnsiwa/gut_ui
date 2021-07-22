import { del, get, getWithParams } from '../helpers/httpHelper';

const API_URL = '/category';

export const getParentCategories = (num, size, sortBy) => {
  const params = {
    num,
    size,
    sortBy,
  };

  return getWithParams(API_URL + '/parent/page', params);
};

export const getChildCategories = (num, size, sortBy) => {
  const params = {
    num,
    size,
    sortBy,
  };

  return getWithParams(API_URL + '/page', params);
};

export const countParentCategories = () => {
  return get(API_URL + '/parent/count');
};

export const countChildCategories = () => {
  return get(API_URL + '/count');
};

export const countParentCategoriesWithConditions = (name) => {
  return getWithParams(API_URL + '/parent/count-condition', {
    name,
  });
};

export const countChildCategoriesWithConditions = (name) => {
  return getWithParams(API_URL + '/count-condition', {
    name,
  });
};

export const searchByName = (num, size, sortBy, name, parent) => {
  return getWithParams(API_URL + '/search', {
    num,
    size,
    sortBy,
    name,
    parent,
  });
};

export const getCategoryParent = (id) => {
  return get(API_URL + `/parent/${id}`);
};

export const getChildCategory = (id) => {
  return get(API_URL + `/${id}`);
};

export const deleteCategoryParent = (id) => {
  return del(API_URL + '/parent/delete/' + id);
};

export const deleteChildCategory = (id) => {
  return del(API_URL + '/delete/' + id);
};
