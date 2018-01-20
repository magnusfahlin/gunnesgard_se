import {
    USER_FETCH_REQUEST,
    USER_FETCH_SUCCESS,
    USER_FETCH_FAILURE,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAILURE
  } from "../actionTypes";

import { getApi, patchApi, handleError } from "./utils";

export const fetchUser = (userId, token) => dispatch => {
  getApi(
      dispatch,
      USER_FETCH_REQUEST,
      "users/" + userId,
      token
    )
      .then(result => dispatch({ type: USER_FETCH_SUCCESS, result }))
      .catch(error => handleError(dispatch, USER_FETCH_FAILURE, error));
  };

  export const updateUser = (userId, userPatch, token) => dispatch => {
    patchApi(
        dispatch,
        USER_UPDATE_REQUEST,
        "users",
        userId,
        userPatch,
        token
      )
        .then(result => dispatch({ type: USER_UPDATE_SUCCESS, result }))
        .catch(error => handleError(dispatch, USER_UPDATE_FAILURE, error));
    };