import { combineReducers } from "redux";
import login from "./login";
import menu from "./menu";
import posts from "./posts";
import session from "./session";
import modal from "./modal";
import password from "./password";
import users from "./users";

const rootReducer = combineReducers({
  login,
  menu,
  modal,
  posts,
  password,
  session,
  users
});

export default rootReducer;
