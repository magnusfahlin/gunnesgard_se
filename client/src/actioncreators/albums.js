import {
    ALBUMS_CREATE_REQUEST,
    ALBUMS_CREATE_SUCCESS,
    ALBUMS_CREATE_FAILURE,
    ALBUMS_FETCH_REQUEST,
    ALBUMS_FETCH_SUCCESS,
    ALBUMS_FETCH_FAILURE,
    ALBUM_PHOTO_NEW_PHOTO_STAGED,
    ALBUM_PHOTO_CREATE_REQUEST,
    ALBUM_PHOTO_CREATE_SUCCESS,
    ALBUM_PHOTO_CREATE_FAILURE, ALBUMS_TOGGLE_SHOW_ALBUM
} from "../actionTypes";
import {getApi, postApi, postFormDataApi, handleError} from "./utils";

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
        .then(result => dispatch({type: ALBUMS_CREATE_SUCCESS, result}))
        .catch(error => handleError(dispatch, ALBUMS_CREATE_FAILURE, error));
};

export const fetchAlbums = token => dispatch => {
    getApi(
        dispatch,
        ALBUMS_FETCH_REQUEST,
        "albums?sort=createdAt&sortOrder=desc",
        token
    )
        .then(result => dispatch({type: ALBUMS_FETCH_SUCCESS, result}))
        .catch(error => handleError(dispatch, ALBUMS_FETCH_FAILURE, error));
};

export const newPhotoStaged = (photoContainer, index) => dispatch => {
    dispatch({
        type: ALBUM_PHOTO_NEW_PHOTO_STAGED,
        data : {
            photoContainer: photoContainer,
            index
        }});
};

export const createPhoto = (albumId, photoContainer, title, text, token) => dispatch => {
    const data = new FormData();
    data.append("file", photoContainer.photo, photoContainer.photo.name);
   // data.append("title", title);
  //  data.append("text", text);
    postFormDataApi(
        dispatch,
        {
            id : photoContainer.tempId,
            type: ALBUM_PHOTO_CREATE_REQUEST
        },
        "albums/" + albumId + "/photos",
        data,
        token
    )
        .then(result => dispatch({type: ALBUM_PHOTO_CREATE_SUCCESS, result}))
        .catch(error =>
            handleError(
                dispatch,
                {
                    id : photoContainer.tempId,
                    type: ALBUM_PHOTO_CREATE_FAILURE},
                error
            )
        );
};

export const toggleShowAlbum = id => dispatch => {
    dispatch({
        type: ALBUMS_TOGGLE_SHOW_ALBUM,
        data : {
            id: id
        }});
};
