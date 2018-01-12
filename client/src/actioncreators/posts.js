import {
  POSTS_CREATE_SUCCESS,
  POSTS_CREATE_FAILURE,
  POSTS_CREATE_REQUEST,
  POSTS_FETCH_REQUEST,
  POSTS_FETCH_SUCCESS,
  POSTS_FETCH_FAILURE,
  POST_COMMENT_CREATE_REQUEST,
  POST_FETCH_SUCCESS,
  POST_COMMENT_CREATE_FAILURE
} from "../actionTypes";
import { getApi, postApi, handleError } from "./utils";

export const createPost = (title, text, location, token) => dispatch => {
  postApi(
    dispatch,
    POSTS_CREATE_REQUEST,
    "posts",
    {
      username: "Magnus-placeholder",
      title,
      text,
      location
    },
    token
  )
    .then(result => dispatch({ type: POSTS_CREATE_SUCCESS, result }))
    .catch(error => handleError(dispatch, POSTS_CREATE_FAILURE, error));
};

export const fetchPosts = token => dispatch => {
  getApi(
    dispatch,
    POSTS_FETCH_REQUEST,
    "posts?sort=createdAt&sortOrder=desc",
    token
  )
    .then(result => dispatch({ type: POSTS_FETCH_SUCCESS, result }))
    .catch(error => handleError(dispatch, POSTS_FETCH_FAILURE, error));
};

export const createComment = (postId, text, token) => dispatch => {
  postApi(
    dispatch,
    {
      postId,
      type: POST_COMMENT_CREATE_REQUEST
    },
    "posts/" + postId + "/comments",
    { text },
    token
  )
    .then(() => getApi(dispatch, null, "posts/" + postId, token))
    .then(result => dispatch({ type: POST_FETCH_SUCCESS, result }))
    .catch(error =>
      handleError(
        dispatch,
        { type: POST_COMMENT_CREATE_FAILURE, postId },
        error
      )
    );
};
