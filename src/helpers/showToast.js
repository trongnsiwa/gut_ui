import { toast } from 'react-toastify';
import { hideLoader } from '../actions/LoaderAction';
import ERRORS from '../constants/Errors';
import SUCCESS from '../constants/Success';
import { format } from './formatString';

export const showSuccess = (message) => {
  toast.success('✔️ ' + message, {
    position: 'top-right',
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
  });
};

export const showError = (message) => {
  toast.error('❌ ' + message, {
    position: 'top-right',
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
  });
};

export const showSuccessMessage = (res, id, dispatch) => {
  console.log(res.data.data);
  var message = SUCCESS[res.data.successCode];
  if (message) {
    message = format(message, id);
  } else {
    message = res.data.successCode;
  }

  showSuccess(message.toString());
  dispatch(hideLoader());
};

export const showErrorMessage = (error, id, dispatch) => {
  const code =
    (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

  var message = ERRORS[code];
  if (message) {
    message = format(message, id);
  } else {
    message = code;
  }

  showError(message.toString());
  dispatch(hideLoader());
};
