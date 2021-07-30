import { hideLoader } from '../actions/LoaderAction';
import { setMessage } from '../actions/MessageAction';
import ERRORS from '../constants/Errors';
import { format } from './formatString';

export const showStoreErrorMessage = (error, id, dispatch) => {
  const code =
    (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

  var message = ERRORS[code];
  if (message) {
    message = format(message, id);
  } else {
    message = code;
  }

  dispatch(setMessage(message));
  dispatch(hideLoader());
};
