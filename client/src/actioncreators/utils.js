const port = process.env.PORT || 3001
const endpointRoot = process.env.SAME_ORIGIN ? "" : "http://localhost:" + port +"/"

export const thunkCreator = (action) => {
  const { types, promise, ...rest } = action
  const [ REQUESTED, RESOLVED, REJECTED ] = types

  return (dispatch) => {
    dispatch({ ...rest, type: REQUESTED })

    return promise
      .then(result => {
        if (result.error) return Promise.reject(result.error)
        dispatch({ ...rest, type: RESOLVED, result })
        return result
      })
      .catch(error => {
        dispatch({ ...rest, type: REJECTED, error })
        throw error
      })
  }
}

export const getApi = (path) =>  fetch(endpointRoot + path,
{
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    cache: 'no-store'});

    export const postApi = (path, data) =>  fetch(endpointRoot + path,
{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify(data)});
