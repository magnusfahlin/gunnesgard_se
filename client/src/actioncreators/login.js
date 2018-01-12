import * as A from "../actionTypes";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT_SUCCESS,
  POSTS_FETCH_REQUEST
} from "../actionTypes";
import { postApi, handleError } from "./utils";
import { fetchPosts } from "./posts";

export const login = (username, password) => dispatch => {
  postApi(dispatch, LOGIN_REQUEST, "login", { username, password })
    .then(result => dispatch({ type: LOGIN_SUCCESS, result }))
    .catch(error => dispatch({ type: LOGIN_ERROR, error }));
};

export const signOut = () => dispatch => {
  Promise.all([dispatch({ type: LOGOUT_SUCCESS }), dispatch(fetchPosts())]);
};
