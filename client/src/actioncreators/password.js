import {
    PASSWORD_UPDATE_REQUEST,
    PASSWORD_UPDATE_FAILURE,
    PASSWORD_UPDATE_SUCCESS
  } from "../actionTypes";

import { patchApi, handleError } from "./utils";

export const updateUserPassword = (userId, password, token) => dispatch => {
  patchApi(
      dispatch,
      PASSWORD_UPDATE_REQUEST,
      "users",
      userId,
      {
        password: password
      },
      token
    )
      .then(result => dispatch({ type: PASSWORD_UPDATE_SUCCESS, result }))
      .catch(error => handleError(dispatch, PASSWORD_UPDATE_FAILURE, error));
  };