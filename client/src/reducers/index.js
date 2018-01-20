import { combineReducers } from "redux";
import login from "./login";
import menu from "./menu";
import posts from "./posts";
import session from "./session";
import modal from "./modal";
import password from "./password";
import user from "./user";

const rootReducer = combineReducers({
  login,
  menu,
  modal,
  posts,
  password,
  session,
  user
});

export default rootReducer;
