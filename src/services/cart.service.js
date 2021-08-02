import { del, get, post, put } from '../helpers/httpHelper';

const API_URL = '/cart';

export const addToCart = (userId, productId, colorId, sizeId, amount) => {
  return post(`${API_URL}/addToCart`, {
    userId,
    productId,
    colorId,
    sizeId,
    amount,
  });
};

export const updateItem = (userId, productId, amount) => {
  return put(`${API_URL}/updateItem`, {
    userId,
    productId,
    amount,
  });
};

export const removeItem = (userId, productId) => {
  return del(`${API_URL}/removeItem`, {
    userId,
    productId,
  });
};

export const clearCart = (userId) => {
  return del(`${API_URL}/clearCart`, {
    userId,
  });
};

export const getUserCart = (userId) => {
  return get(`${API_URL}/${userId}`);
};
