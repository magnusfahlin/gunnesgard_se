import * as A from "../actionTypes";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT_SUCCESS,
  POSTS_FETCH_REQUEST
} from "../actionTypes";
import { postApi } from "./utils";
import { fetchPosts } from "./posts";

export const login = (userName, password) => dispatch => {
  dispatch({ type: LOGIN_REQUEST });

  return postApi("login", { userName, password })
    .then(response => {
      if (response.status != 201) return Promise.reject(response.error);
      return response.json();
    })
    .then(result => {
      Promise.all([
        dispatch({ type: LOGIN_SUCCESS, result }),
        dispatch(fetchPosts(result.token))
      ]);
    })
    .catch(error => {
      dispatch({ type: LOGIN_ERROR, error });
    });
};

export const signOut = () => dispatch => {
  Promise.all([dispatch({ type: LOGOUT_SUCCESS }), dispatch(fetchPosts())]);
};
