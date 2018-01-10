import {combineReducers} from 'redux';
import login from './login';
import menu from './menu';
import posts from './posts';
import session from './session';
import modal from './modal';
const rootReducer = combineReducers({
  login,
  posts,
  menu,
  modal,
  session
})

export default rootReducer;