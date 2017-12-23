import {
  POSTS_CREATE_SUCCESS,
  POSTS_CREATE_FAILURE,
  POSTS_CREATE_REQUEST,
  POSTS_FETCH_REQUEST,
  POSTS_FETCH_SUCCESS,
  POSTS_FETCH_FAILURE,
  LOGIN_SUCCESS_USER,
  LOGOUT_SUCCESS
} from "../actionTypes";
import initialState from "./../data/initialState";
import * as postActions from "./../actioncreators/posts.js";

export default function postsReducer(state = initialState.posts, action) {
  switch (action.type) {
    case POSTS_FETCH_REQUEST: {
      return {
        ...state,
        loading: true,
        error: false
      };
    }
    case POSTS_FETCH_SUCCESS: {
      return {
        loading: false,
        error: false,
        posts: action.result
      };
    }
    case POSTS_FETCH_FAILURE: {
      return {
        ...state,
        loading: false,
        error: true
      };
    }
    case POSTS_CREATE_REQUEST: {
      return {
        ...state,
        loading: true,
        error: false
      };
    }
    case POSTS_CREATE_SUCCESS: {
      return () => postActions.fetchPosts();
    }
    case POSTS_CREATE_FAILURE: {
      return {
        ...state,
        loading: false,
        error: true
      };
    }
    case LOGIN_SUCCESS_USER: {
      return {
        ...state,
        showAddComment: true,
        showComments: true
      };
    }
    case LOGOUT_SUCCESS: {
      return {
        ...state,
        showAddComment: false,
        showComments: false
      };
    }
    default:
      return state;
  }
}
