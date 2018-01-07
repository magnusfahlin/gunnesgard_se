const port = process.env.PORT || 3001;
const endpointRoot = process.env.SAME_ORIGIN
  ? ""
  : "http://localhost:" + port + "/";

export const thunkCreator = action => {
  const { types, promise, ...rest } = action;
  const [REQUESTED, RESOLVED, REJECTED] = types;

  return dispatch => {
    dispatch({ ...rest, type: REQUESTED });

    return promise
      .then(result => {
        if (result.error) return Promise.reject(result.error);
        dispatch({ ...rest, type: RESOLVED, result });
        return result;
      })
      .catch(error => {
        dispatch({ ...rest, type: REJECTED, error });
      });
  };
};

const createHeaders = (token, contentType) => {
  var headers = {
    Accept: "application/json"
  };

  if (token) headers["x-Auth"] = token;

  if (contentType) headers["Content-Type"] = contentType;

  return headers;
};

export const getApi = (path, token) =>
  fetch(endpointRoot + path, {
    method: "GET",
    headers: createHeaders(token),
    cache: "no-store"
  });

export const postApi = (path, data, token) =>
  fetch(endpointRoot + path, {
    method: "POST",
    headers: createHeaders(token, "application/json"),
    cache: "no-store",
    body: JSON.stringify(data)
  });
