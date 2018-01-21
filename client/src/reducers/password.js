import {
  PASSWORD_UPDATE_REQUEST,
  PASSWORD_UPDATE_FAILURE,
  PASSWORD_UPDATE_SUCCESS
} from "../actionTypes";
import initialState from "./../data/initialState";

const password = (state = initialState.password, action) => {
  switch (action.type) {
    case PASSWORD_UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        success: false,
      };
    case PASSWORD_UPDATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: true,
        success: false,
      };
      case PASSWORD_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
      };
    default:
      return state;
  }
};

export default password;
