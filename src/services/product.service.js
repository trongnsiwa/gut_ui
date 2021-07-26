import { del, get, getWithParams, put, post } from '../helpers/httpHelper';

const API_URL = '/product';

export const getProducts = (num, size, sortBy) => {
  const params = {
    num,
    size,
    sortBy,
  };

  return getWithParams(API_URL + '/page', params);
};

export const getProductsByCategory = (category, num, size, sort) => {
  const params = {
    category,
    num,
    size,
    sort,
  };

  return getWithParams(API_URL + '/category/page', params);
};

export const searchProductsByName = (num, size, sortBy, name) => {
  return getWithParams(API_URL + '/search', {
    num,
    size,
    sortBy,
    name,
  });
};

export const searchProductsByCategoryAndName = (category, num, size, sort, name) => {
  return getWithParams(API_URL + '/category/search', {
    category,
    num,
    size,
    sort,
    name,
  });
};

export const countProducts = () => {
  return get(API_URL + '/count');
};

export const countProductsByName = (name) => {
  return getWithParams(API_URL + '/count-name', {
    name,
  });
};

export const countProductsByCategory = (category) => {
  return getWithParams(API_URL + '/category/count', {
    category,
  });
};

export const countProductsByCategoryAndName = (category, name) => {
  return getWithParams(API_URL + '/category/count-name', {
    category,
    name,
  });
};

export const getProductDetail = (id) => {
  return get(API_URL + `/${id}`);
};

export const deleteProduct = (id) => {
  return del(API_URL + `/${id}`);
};

export const updateProduct = (
  id,
  name,
  price,
  shortDesc,
  longDesc,
  material,
  handling,
  sale,
  priceSale,
  saleFromDate,
  saleToDate,
  deleted,
  colors,
  categoryId,
  brandId
) => {
  return put(API_URL, {
    id,
    name,
    price,
    shortDesc,
    longDesc,
    material,
    handling,
    sale,
    priceSale,
    saleFromDate,
    saleToDate,
    deleted,
    colors,
    categoryId,
    brandId,
  });
};

export const addProduct = (
  name,
  price,
  shortDesc,
  longDesc,
  material,
  handling,
  sale,
  priceSale,
  saleFromDate,
  saleToDate,
  colors,
  categoryId,
  brandId
) => {
  return post(API_URL, {
    name,
    price,
    shortDesc,
    longDesc,
    material,
    handling,
    sale,
    priceSale,
    saleFromDate,
    saleToDate,
    colors,
    categoryId,
    brandId,
  });
};

export const replaceImages = (productId, images) => {
  return put(API_URL + '/images', {
    productId,
    images,
  });
};
