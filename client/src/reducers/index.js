import {combineReducers} from 'redux';
import authentication from './authentication';
import menu from './menu';
import blogpost from './blogpost';

const rootReducer = combineReducers({
  authentication,
  blogpost,
  menu
})

export default rootReducer;