import {combineReducers} from 'redux';
import authentication from './authentication';
import menu from './menu';
import postViewer from './postViewer';
import posts from './posts';
const rootReducer = combineReducers({
  authentication,
  posts,
  postViewer,
  menu
})

export default rootReducer;