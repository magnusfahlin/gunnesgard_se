import { LOGIN_SUCCESS, LOGOUT_SUCCESS, LOGIN_REQUEST, LOGIN_ERROR } from "../actionTypes";
import initialState from "./../data/initialState";

const login = (state = initialState.login, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: false
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        error: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
      };
    default:
      return state;
  }
};

export default login;
