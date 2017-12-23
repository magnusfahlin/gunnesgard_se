import {combineReducers} from 'redux';
import authentication from './authentication';
import menu from './menu';
import posts from './posts';
const rootReducer = combineReducers({
  authentication,
  posts,
  menu
})

export default rootReducer;