import { combineReducers } from "redux";
import login from "./login";
import menu from "./menu";
import posts from "./posts";
import session from "./session";
import modal from "./modal";
import password from "./password";
import users from "./users";
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const authPersistConfig = {
  key: 'session',
  storage: storage,
  blacklist: ['somethingTemporary']
}
const rootReducer = combineReducers({
  session: persistReducer(authPersistConfig, session),
  login,
  menu,
  modal,
  posts,
  password,
  users
});

export default rootReducer;
