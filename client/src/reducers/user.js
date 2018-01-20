import {
  USER_FETCH_REQUEST,
  USER_FETCH_SUCCESS,
  USER_FETCH_FAILURE,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAILURE
} from "../actionTypes";

import initialState from "./../data/initialState";

const modal = (state = initialState.user, action) => {
  switch (action.type) {
    case USER_FETCH_REQUEST:
      return {
        ...state,
        user: {},
        loading: true,
        error: false,
      };
    case USER_FETCH_FAILURE:
      return {
        ...state,
        user: {},
        loading: false,
        error: true,
      };
      case USER_FETCH_SUCCESS:
      return {
        ...state,
        user: action.result,
        loading: false,
        error: false
      };
    default:
      return state;
  }
};

export default modal;
