import {
    ALBUMS_CREATE_REQUEST,
    ALBUMS_CREATE_SUCCESS,
    ALBUMS_CREATE_FAILURE,
    ALBUMS_FETCH_REQUEST,
    ALBUMS_FETCH_SUCCESS,
    ALBUMS_FETCH_FAILURE,
} from "../actionTypes";
import { getApi, postApi, handleError } from "./utils";

export const createAlbum = (title, text, location, token) => dispatch => {
    postApi(
        dispatch,
        ALBUMS_CREATE_REQUEST,
        "albums",
        {
            title
        },
        token
    )
        .then(result => dispatch({ type: ALBUMS_CREATE_SUCCESS, result }))
        .catch(error => handleError(dispatch, ALBUMS_CREATE_FAILURE, error));
};

export const fetchAlbums = token => dispatch => {
    getApi(
        dispatch,
        ALBUMS_FETCH_REQUEST,
        "albums?sort=createdAt&sortOrder=desc",
        token
    )
        .then(result => dispatch({ type: ALBUMS_FETCH_SUCCESS, result }))
        .catch(error => handleError(dispatch, ALBUMS_FETCH_FAILURE, error));
};
//
// export const createComment = (postId, text, token) => dispatch => {
//     postApi(
//         dispatch,
//         {
//             postId,
//             type: POST_COMMENT_CREATE_REQUEST
//         },
//         "posts/" + postId + "/comments",
//         { text },
//         token
//     )
//         .then(() => getApi(dispatch, null, "posts/" + postId, token))
//         .then(result => dispatch({ type: POST_FETCH_SUCCESS, result }))
//         .catch(error =>
//             handleError(
//                 dispatch,
//                 { type: POST_COMMENT_CREATE_FAILURE, postId },
//                 error
//             )
//         );
// };
