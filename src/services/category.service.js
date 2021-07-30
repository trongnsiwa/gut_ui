import { del, get, getWithParams, put, post } from '../helpers/httpHelper';

const API_URL = '/category';

export const getAllParentCategories = () => {
  return get(`${API_URL}/parent`);
};

export const getAllChildCategories = () => {
  return get(`${API_URL}/child`);
};

export const getParentCategories = (num, size, sortBy) => {
  const params = {
    num,
    size,
    sortBy,
  };

  return getWithParams(`${API_URL}/page`, params);
};

export const searchByName = (num, size, sortBy, name) => {
  return getWithParams(`${API_URL}/search`, {
    num,
    size,
    sortBy,
    name,
  });
};

export const searchByParentAndName = (parent, num, size, sortBy, name) => {
  return getWithParams(`${API_URL}/search-parent`, {
    parent,
    num,
    size,
    sortBy,
    name,
  });
};

export const countParents = () => {
  return get(`${API_URL}/count`);
};

export const countByName = (name) => {
  return getWithParams(`${API_URL}/count-name`, {
    name,
  });
};

export const countByParentAndName = (parent, name) => {
  return getWithParams(`${API_URL}/count-parent`, {
    parent,
    name,
  });
};

export const getCategoryParent = (id) => {
  return get(`${API_URL}/parent/${id}`);
};

export const getChildCategory = (id) => {
  return get(`${API_URL}/${id}`);
};

export const deleteCategoryParent = (id) => {
  return del(`${API_URL}/parent/delete/${id}`);
};

export const deleteChildCategory = (id) => {
  return del(`${API_URL}/delete/${id}`);
};

export const updateParentCategory = (id, name) => {
  return put(`${API_URL}/parent`, {
    id,
    name,
  });
};

export const updateCategoryWithParentId = (id, name, parentId) => {
  return put(API_URL, {
    id,
    name,
    parentId,
  });
};

export const updateCategoryNonParentId = (id, name) => {
  return put(API_URL, {
    id,
    name,
  });
};

export const createCategoryParent = (name) => {
  return post(`${API_URL}/parent`, {
    name,
  });
};

export const createCategory = (name, parentId) => {
  return post(API_URL, {
    name,
    parentId,
  });
};
