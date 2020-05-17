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
        case Action.ALBUMS_CREATE_REQUEST: {
            return {
                ...state,
                AlbumCreateRequest: true,
                AlbumCreateError: false
            };
        }
        case Action.ALBUMS_CREATE_FAILURE: {
            return {
                ...state,
                albumCreateRequest: false,
                albumCreateError: true
            };
        }
        case Action.ALBUM_PHOTO_NEW_PHOTO_STAGED: {
            let photoContainer = action.data.photoContainer;
            const currentIndex = state.newPhotos.indexOf(photoContainer.tempId)
            if (currentIndex > -1)
            {
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
            const index = state.photosIndexByIdMap[action.id];
            state.newPhotos[index].photoCreateRequest = true;

            return {
                ...state
            };
        }
        case Action.ALBUM_PHOTO_CREATE_SUCCESS: {
            const index = state.photosIndexByIdMap[action.id];
            state.newPhotos = this.state.newPhotos.splice(index, 1);
            state.photosIndexByIdMap = this.state.photosIndexByIdMap.splice(this.state.list.indexOf(action.id), 1);
            state.existingPhotos.Add(action)

            return {
                ...state
            };
        }
        case Action.ALBUM_PHOTO_CREATE_FAILURE: {
            const index = state.photosIndexByIdMap[action.id];
            state.newPhotos[index].photoCreateRequest = false;
            state.newPhotos[index].photoCreateError = true;

            return {
                ...state
            };
        }
        default:
            return state;
    }
}
