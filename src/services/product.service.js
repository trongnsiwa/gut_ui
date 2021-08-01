import { del, get, getWithParams, put, post } from '../helpers/httpHelper';

const API_URL = '/product';

export const getProducts = (num, size, sortBy, saleTypes, colorIds, sizeIds, fromPrice, toPrice) => {
  const params = {
    num,
    size,
    sortBy,
    saleTypes,
    colorIds,
    sizeIds,
    fromPrice,
    toPrice,
  };

  return getWithParams(`${API_URL}/page`, params);
};

export const getProductsByCategory = (category, num, size, sort, saleTypes, colorIds, sizeIds, fromPrice, toPrice) => {
  const params = {
    category,
    num,
    size,
    sort,
    saleTypes,
    colorIds,
    sizeIds,
    fromPrice,
    toPrice,
  };

  return getWithParams(`${API_URL}/category/page`, params);
};

export const searchProductsByName = (num, size, sortBy, name, saleTypes, colorIds, sizeIds, fromPrice, toPrice) => {
  return getWithParams(`${API_URL}/search`, {
    num,
    size,
    sortBy,
    name,
    saleTypes,
    colorIds,
    sizeIds,
    fromPrice,
    toPrice,
  });
};

export const searchProductsByCategoryAndName = (
  category,
  num,
  size,
  sort,
  name,
  saleTypes,
  colorIds,
  sizeIds,
  fromPrice,
  toPrice
) => {
  return getWithParams(`${API_URL}/category/search`, {
    category,
    num,
    size,
    sort,
    name,
    saleTypes,
    colorIds,
    sizeIds,
    fromPrice,
    toPrice,
  });
};

export const countProducts = (saleTypes, colorIds, sizeIds, fromPrice, toPrice) => {
  return getWithParams(`${API_URL}/count`, {
    saleTypes,
    colorIds,
    sizeIds,
    fromPrice,
    toPrice,
  });
};

export const countProductsByName = (name, saleTypes, colorIds, sizeIds, fromPrice, toPrice) => {
  return getWithParams(`${API_URL}/count-name`, {
    name,
    saleTypes,
    colorIds,
    sizeIds,
    fromPrice,
    toPrice,
  });
};

export const countProductsByCategory = (category, saleTypes, colorIds, sizeIds, fromPrice, toPrice) => {
  return getWithParams(`${API_URL}/category/count`, {
    category,
    saleTypes,
    colorIds,
    sizeIds,
    fromPrice,
    toPrice,
  });
};

export const countProductsByCategoryAndName = (category, name, saleTypes, colorIds, sizeIds, fromPrice, toPrice) => {
  return getWithParams(`${API_URL}/category/count-name`, {
    category,
    name,
    saleTypes,
    colorIds,
    sizeIds,
    fromPrice,
    toPrice,
  });
};

export const getProductDetail = (id) => {
  return get(`${API_URL}/${id}`);
};

export const deleteProduct = (id) => {
  return del(`${API_URL}/${id}`);
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
  return put(`${API_URL}/images`, {
    productId,
    images,
  });
};

export const addUserReviewToProduct = (productId, userId, title, comment, rating) => {
  return put(`${API_URL}/review`, {
    productId,
    userId,
    title,
    comment,
    rating,
  });
};
