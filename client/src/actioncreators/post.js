import {
  POST_COMMENT_CREATE_REQUEST,
  POST_FETCH_SUCCESS,
  POST_COMMENT_CREATE_FAILURE
} from "../actionTypes";
import { thunkCreator, getApi, postApi } from "./utils";

let postCommentPromise = (postId, text, token) =>
  postApi("posts/" + postId + "/comments", { text }, token);

export const createComment = (postId, text, token) => dispatch => {
  dispatch({ postId, type: POST_COMMENT_CREATE_REQUEST });

  return postCommentPromise(postId, text, token)
    .then(result => {
      if (!result.ok)
        return Promise.reject(result.statusText + " " + result.url);

        getApi("posts/" + postId, token)
        .then(response => response.json())
        .then(result => {
          if (result.error) return Promise.reject(result.error);
          dispatch({ postId, type: POST_FETCH_SUCCESS, result });
          return result;
        });
    })
    .catch(error => {
      dispatch({ postId, type: POST_COMMENT_CREATE_FAILURE, error });
    });
};
