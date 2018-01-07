import {combineReducers} from 'redux';
import login from './login';
import menu from './menu';
import posts from './posts';
import session from './session';
const rootReducer = combineReducers({
  login,
  posts,
  menu,
  session
})

export default rootReducer;