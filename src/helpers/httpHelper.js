import axios from 'axios';
import authHeader from '../services/auth-header';

const endpoint = 'http://localhost:8080/gut-service/api';

export const get = (url) => {
  return axios.get(endpoint + url, {
    headers: authHeader(),
  });
};

export const post = (url, body) => {
  return axios.post(endpoint + url, body, {
    headers: authHeader(),
  });
};

export const put = (url, body) => {
  return axios.post(endpoint + url, body, {
    headers: authHeader(),
  });
};

export const del = (url, body) => {
  return axios.delete(endpoint + url, body, {
    headers: authHeader(),
  });
};
