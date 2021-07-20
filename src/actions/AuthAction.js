import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  SET_MESSAGE,
} from '../constants/ActionTypes';
import ERRORS from '../constants/Errors';
import SUCCESS from '../constants/Success';
import { loginService, logoutService, registerService } from '../services/auth.service';

export const register = (email, password, retypePassword, firstName, lastName) => (dispatch) => {
  return registerService(email, password, retypePassword, firstName, lastName).then(
    (res) => {
      dispatch({
        type: REGISTER_SUCCESS,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: SUCCESS[res.data.successCode],
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

      dispatch({
        type: REGISTER_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: ERRORS[message],
      });

      return Promise.reject();
    }
  );
};

export const login = (email, password) => (dispatch) => {
  return loginService(email, password).then(
    (data) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: data },
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

      dispatch({
        type: LOGIN_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: ERRORS[message],
      });

      return Promise.reject();
    }
  );
};

export const logout = () => (dispatch) => {
  logoutService();

  dispatch({
    type: LOGOUT,
  });
};
