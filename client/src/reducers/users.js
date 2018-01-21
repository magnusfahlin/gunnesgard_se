import {
  USER_FETCH_REQUEST,
  USER_FETCH_SUCCESS,
  USER_FETCH_FAILURE,
  USERS_FETCH_REQUEST,
  USERS_FETCH_SUCCESS,
  USERS_FETCH_FAILURE,
  USERS_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAILURE
} from "../actionTypes";

import initialState from "./../data/initialState";
import session from "./session";

const users = (state = initialState.users, action) => {
  switch (action.type) {
    case USER_FETCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: false
      };
    case USER_FETCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: true
      };
    case USER_FETCH_SUCCESS:
    case USER_UPDATE_SUCCESS:
      let indexMap = state.indexByIdMap;
      const user = action.result;
      const userIndex = indexMap[user.id];
      let newUsers;

      if (userIndex !== undefined) {
        newUsers = [
          ...state.users.slice(0, userIndex),
          user,
          ...state.users.slice(userIndex + 1)
        ];
      } else {
        newUsers = [...state.users, user];

        const newElement = {};
        newElement[user.id] = Object.keys(indexMap).length;
        indexMap = Object.assign(indexMap, newElement);
      }
      
      return {
        ...state,
        indexByIdMap : indexMap,
        users: newUsers,
        loading: false,
        error: false
      };
    case USERS_FETCH_REQUEST:
      return {
        ...state,
        indexByIdMap : {},        
        users: [],
        loading: true,
        error: false
      };
    case USERS_FETCH_FAILURE:
      return {
        indexByIdMap : {},        
        users: [],
        loading: false,
        error: true
      };
    case USERS_FETCH_SUCCESS:
      let indexByIdMap = {};
      let i = 0;
      action.result.forEach(user => (indexByIdMap[user.id] = i++));

      return {
        ...state,
        indexByIdMap : indexByIdMap,
        users: action.result,
        loading: false,
        error: false
      };
    default:
      return state;
  }
};

export default users;
