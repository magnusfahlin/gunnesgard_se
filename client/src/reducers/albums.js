import * as Action from "../actionTypes";
import initialState from "./../data/initialState";
import * as albumsActions from "./../actioncreators/albums.js";

export default function albumsReducer(state = initialState.albums, action) {
    switch (action.type) {
        case Action.ALBUMS_FETCH_REQUEST: {
            return {
                ...state,
                loading: true,
                error: false
            };
        }
        case Action.ALBUMS_FETCH_SUCCESS: {

            return {
                ...state,
                loading: false,
                error: false,
                albums: action.result,
            };
        }
        case Action.ALBUMS_FETCH_FAILURE: {
            return {
                ...state,
                loading: false,
                error: true
            };
        }
        case Action.ALBUM_FETCH_SUCCESS: {
            const album = action.result;
            const albumIndex = state.albums.map(e => e.id).indexOf(album.id);

            state.albums[albumIndex] = album;
            return {
                ...state,
            };
        }
        case Action.ALBUMS_CREATE_REQUEST: {
            return {
                ...state,
                AlbumCreateRequest: true,
                AlbumCreateError: false
            };
        }
        case Action.ALBUM_MODIFICATION_REQUEST: {
            state.albumModificationStatus[action.data.albumId] = {loading : true};

            return {
                ...state,
                albumCreateRequest: false,
                albumCreateError: false
            };
        }
        case Action.ALBUM_MODIFICATION_FINNISHED: {
                state.albumModificationStatus[action.data.albumId] = {errors : action.data.errors};

            return {
                ...state
            };
        }
        case Action.ALBUM_PHOTO_NEW_PHOTO_STAGED: {
            let photoContainer = action.data.photoContainer;
            const currentIndex = state.newPhotos.indexOf(photoContainer.tempId)
            if (currentIndex > -1) {
                state.newPhotos[currentIndex] = photoContainer;
            } else {
                state.newPhotos.push(photoContainer);
                state.photosIndexByIdMap[photoContainer.tempId] = state.newPhotos.length - 1;
            }

            return {
                ...state
            };
        }
        case Action.ALBUM_PHOTO_CREATE_REQUEST: {
          //  const index = state.photosIndexByIdMap[action.id];
        //    state.newPhotos[index].photoCreateRequest = true;

            return {
                ...state
            };
        }
    /*    case Action.ALBUM_PHOTO_CREATE_SUCCESS: {

            const albumIndex = state.albums.map(e => e.id).indexOf(action.data.albumId);
            let currentPhotos = [...state.albums[albumIndex].photos, action.data.photo]
            state.albums[albumIndex].photos = currentPhotos;

            return {
                ...state
            };
        }*/
        case Action.ALBUM_PHOTO_CREATE_FAILURE: {
            // const index = state.photosIndexByIdMap[action.id];
            // state.newPhotos[index].photoCreateRequest = false;
            // state.newPhotos[index].photoCreateError = true;

            return {
                ...state
            };
        }
        case Action.ALBUMS_TOGGLE_SHOW_ALBUM: {

            if (state.albumsToShow.includes(action.data.id)) {
                state.albumsToShow = state.albumsToShow.filter(id => id !== action.data.id);
            } else {
                state.albumsToShow = [...state.albumsToShow, action.data.id];
            }
            return {
                ...state
            };
        }
        default:
            return state;
    }
}
