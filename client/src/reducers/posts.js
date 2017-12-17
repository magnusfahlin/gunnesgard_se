import { POSTS_CREATE_POST, POSTS_LOADED_SUCCESS } from "../actionTypes";
import initialState from "./../data/initialState";

export default function postsReducer (state = initialState.posts, action) {
  switch (action.type) {
    case POSTS_CREATE_POST: {
      const { type, post } = action
      const ts = Date.now()
      return {
        ...state,
        type : POSTS_LOADED_SUCCESS,
        posts :  [...state.posts, action.post]
      }
    }
    case POSTS_LOADED_SUCCESS: {
        return state;
    //   const { type, post } = action
    //   const ts = Date.now()
    //   return [
    //     ...state,
    //     { ...post, date: ts},
    //   ]
    }

    default:
      return state
  }
}

