import {
  PASSWORD_UPDATE_REQUEST,
  PASSWORD_UPDATE_FAILURE,
  PASSWORD_UPDATE_SUCCESS
} from "../actionTypes";
import initialState from "./../data/initialState";

const modal = (state = initialState.password, action) => {
  switch (action.type) {
    case PASSWORD_UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: false
      };
    case PASSWORD_UPDATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: true
      };
      case PASSWORD_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false
      };
    default:
      return state;
  }
};

export default modal;