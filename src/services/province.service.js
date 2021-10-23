import axios from 'axios';

const API_URL = 'https://vapi.vnappmob.com/api';

export const getListProvinces = () => {
  return axios.get(`${API_URL}/province/`);
};

export const getListDistrictsByProvCode = (code) => {
  return axios.get(`${API_URL}/province/district/${code}`);
};

export const getListWardsByDistCode = (code) => {
  return axios.get(`${API_URL}/province/ward${code}`);
};
