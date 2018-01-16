import { MODAL_OPEN } from "../actionTypes";

const port = process.env.PORT || 3001;
const endpointRoot = process.env.SAME_ORIGIN
  ? ""
  : "http://localhost:" + port + "/";

const createHeaders = (token, contentType) => {
  var headers = {
    Accept: "application/json"
  };

  if (token) headers["x-Auth"] = token;

  if (contentType) headers["Content-Type"] = contentType;

  return headers;
};

export function handleError(dispatch, toDispatch, error) {
  if (error.status == 403) {
    dispatch({ type: MODAL_OPEN, modalType: "MODAL_LOGGED_OUT" });
  }

  if (process.env.NODE_ENV == "development")
    console.log(error.status + " " + error.message);

  if (typeof toDispatch === "object") {
    dispatch(toDispatch, error);
  } else {
    dispatch({ type: toDispatch, error });
  }
}

function handleErrorResponse(response) {
  if (!response.ok) {
    throw {
      status: response.status,
      message: response.message
    };
  }
  return response;
}

export const getApi = (dispatch, actionType, path, token) => {
  if (actionType !== null) {
    dispatch({ type: actionType });
  }
  return fetch(endpointRoot + path, {
    method: "GET",
    headers: createHeaders(token),
    cache: "no-store"
  })
    .then(handleErrorResponse)
    .then(response => response.json())
};

export const postApi = (dispatch, toDispatch, path, data, token) => {
  if (typeof toDispatch === "object") {
    dispatch(toDispatch);
  } else {
    dispatch({ type: toDispatch });
  }
  return fetch(endpointRoot + path, {
    method: "POST",
    headers: createHeaders(token, "application/json"),
    cache: "no-store",
    body: JSON.stringify(data)
  })
    .then(handleErrorResponse)
    .then(response => response.json());
};

export const patchApi = (dispatch, toDispatch, path, id, data, token) => {
  if (typeof toDispatch === "object") {
    dispatch(toDispatch);
  } else {
    dispatch({ type: toDispatch });
  }
  return fetch(endpointRoot + path + "/" + id, {
    method: "PATCH",
    headers: createHeaders(token, "application/json"),
    cache: "no-store",
    body: JSON.stringify(data)
  })
    .then(handleErrorResponse)
    .then(response => response.json());
};