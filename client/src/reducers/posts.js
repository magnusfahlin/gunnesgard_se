import { POSTS_CREATE_POST, POSTS_FETCH_SUCCESS, POSTS_FETCH_FAILURE } from "../actionTypes";
import initialState from "./../data/initialState";

export default function postsReducer (state = initialState.posts, action) {
  switch (action.type) {
    case POSTS_CREATE_POST: {
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
        "posts" : action.result.post};
    }
    case POSTS_FETCH_FAILURE: {
      return action;
      //const { type, post } = action
     // return [ ...state, post ]
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

