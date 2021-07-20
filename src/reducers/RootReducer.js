import { combineReducers } from 'redux';
import loaderReducer from './LoaderReducer';
import authReducer from './AuthReducer';
import messageReducer from './MessageReducer';

const rootReducer = combineReducers({
  loaderReducer,
  authReducer,
  messageReducer,
});

export default rootReducer;
