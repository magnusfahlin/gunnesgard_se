import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from "../actionTypes";
import initialState from "./../data/initialState";

const session = (state = initialState.session, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.result.token,
        username: action.result.username,
        loggedIn: true,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        token: "",
        username: " ",
        loggedIn: false,
      };
    default:
      return state;
  }
};

export default session;
