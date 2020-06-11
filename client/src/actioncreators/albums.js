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
    ALBUM_PHOTO_CREATE_FAILURE,
    ALBUMS_TOGGLE_SHOW_ALBUM, POST_FETCH_SUCCESS, ALBUM_FETCH_SUCCESS,
    ALBUM_MODIFICATION_REQUEST,
    ALBUM_MODIFICATION_FINNISHED
} from "../actionTypes";
import {getApi, postApi, postFormDataApi, handleError, multipleRestApi} from "./utils";

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
        data: {
            photoContainer: photoContainer,
            index
        }
    });
};

export const modifyAlbum = (albumId, photoUpdates, photoDeletion, token) => dispatch => {

    let patches = [];

    photoDeletion.forEach(photoIdToDelete => {
        delete photoUpdates[photoIdToDelete]

        patches.push({
            id: photoIdToDelete,
            method: "DELETE",
            path: "albums/" + albumId + "/photos/" + photoIdToDelete
        });
    });

    Object.keys(photoUpdates).map(photoId => {
        patches.push({
            id: photoId,
            method: "PATCH",
            path: "albums/" + albumId + "/photos/" + photoId,
            data: photoUpdates[photoId]
        });
    })

    multipleRestApi(
        dispatch,
        {
            type: ALBUM_MODIFICATION_REQUEST,
            data : {albumId: albumId}
        },
        patches,
        token)
        .then(responses => {
            let errors = [];
            responses.forEach((r, index) => {
                if (r.status != 200 && r.status != 204 && r.status != 204) {
                    errors.push({
                        id: patches[index].id,
                        method: patches[index].method,
                    })
                }
            });

            dispatch({type: ALBUM_MODIFICATION_FINNISHED,
                data : {
                    albumId : albumId,
                    errors : errors
                }});
        })
        .then(() => getApi(dispatch, null, "albums/" + albumId, token))
        .then(result => dispatch({type: ALBUM_FETCH_SUCCESS, result}))
        .catch(error =>
            handleError(
                dispatch,
                {
                    name: "",
                    type: ALBUM_PHOTO_CREATE_FAILURE
                },
                error
            )
        );
};

export const createPhoto = (albumId, file, token) => dispatch => {
    const data = new FormData();
    data.append("file", file);// photoContainer.photo.name);
    // data.append("title", title);
    //  data.append("text", text);
    postFormDataApi(
        dispatch,
        {
            type: ALBUM_PHOTO_CREATE_REQUEST
        },
        "albums/" + albumId + "/photos",
        data,
        token
    ).then(() => getApi(dispatch, null, "albums/" + albumId, token))
        .then(result => dispatch({type: ALBUM_FETCH_SUCCESS, result}))
        .catch(error =>
            handleError(
                dispatch,
                {
                    name: file.name,
                    type: ALBUM_PHOTO_CREATE_FAILURE
                },
                error
            )
        );
};

export const toggleShowAlbum = id => dispatch => {
    dispatch({
        type: ALBUMS_TOGGLE_SHOW_ALBUM,
        data: {
            id: id
        }
    });
};
