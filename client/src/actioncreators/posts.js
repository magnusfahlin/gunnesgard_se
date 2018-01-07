import {
  POSTS_CREATE_SUCCESS,
  POSTS_CREATE_FAILURE,
  POSTS_CREATE_REQUEST,
  POSTS_FETCH_REQUEST,
  POSTS_FETCH_SUCCESS,
  POSTS_FETCH_FAILURE
} from "../actionTypes";
import { thunkCreator, getApi, postApi } from "./utils";

export const createPost = (title, text, location, token) =>
  thunkCreator({
    types: [POSTS_CREATE_REQUEST, POSTS_CREATE_SUCCESS, POSTS_CREATE_FAILURE],
    promise: postApi(
      "posts",
      {
        userName: "Magnus-placeholder",
        title,
        text,
        location
      },
      token
    ).then(response => {
      if (response.status != 201) throw response.status;
      return response.json();
    })
  });

export const fetchPosts = token =>
  thunkCreator({
    types: [POSTS_FETCH_REQUEST, POSTS_FETCH_SUCCESS, POSTS_FETCH_FAILURE],
    promise: getApi("posts?sort=createdAt&sortOrder=desc", token).then(response => {
      if (response.status != 200) throw response.status;
      return response.json();
    })
  });
