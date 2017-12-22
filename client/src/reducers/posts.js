import { POSTS_CREATE_SUCCESS, POSTS_CREATE_FAILURE, POSTS_CREATE_REQUEST, POSTS_FETCH_SUCCESS, POSTS_FETCH_FAILURE } from "../actionTypes";
import initialState from "./../data/initialState";

export default function postsReducer (state = initialState.posts, action) {
  switch (action.type) {
    case POSTS_CREATE_SUCCESS: {
      const { type, post } = action
      const ts = Date.now()
      return {
        ...state,
        type : POSTS_FETCH_SUCCESS,
        posts :  [...state.posts, action.post]
      }
    }
    case POSTS_FETCH_SUCCESS:{
      return {
        "type": action.type,
        "posts" : action.result};
    }
    case POSTS_FETCH_FAILURE: {
      return action;
    }
    case POSTS_CREATE_REQUEST:
    case POSTS_CREATE_FAILURE:
    case POSTS_CREATE_SUCCESS: {
      return action;
    }
    default:
    return state
  }
}

