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
            let indexByIdMap = {};
            let i = 0;
            let newAlbums = [];
            action.result.forEach(album => {
                indexByIdMap[album.id] = i++;

                let c_indexByIdMap = {};
                if (album.photos && Array.isArray(album.photos)) {
                    album.photos.forEach(photo => {
                        c_indexByIdMap[photo.id] = i++;
                    });
                }

                album.photosIndexByIdMap = c_indexByIdMap;
                album.photoCreateRequest = false;
                album.photoCreateError = false;
                newAlbums.push(album);
            });

            return {
                loading: false,
                error: false,
                albumCreateRequest: false,
                albumCreateError: false,
                indexByIdMap: indexByIdMap,
                albums: newAlbums
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
        case Action.ALBUMS_CREATE_SUCCESS:
        case Action.ALBUMS_FETCH_SUCCESS: {
            let album = action.result;

            let c_indexByIdMap = {};
            let i = 0;
            album.photos.forEach(photo => {
                c_indexByIdMap[photo.id] = i++;
            });

            album.photosIndexByIdMap = c_indexByIdMap;
            album.photoCreateRequest = false;
            album.photoCreateError = false;

            let indexByIdMap = state.indexByIdMap;
            const index = indexByIdMap[album.id];
            let newAlbums;
            if (index == undefined) {
                indexByIdMap = {};
                state.albums.forEach(album => (indexByIdMap[album.id] = i++));
                newAlbums = [album, ...state.albums];
            } else {
                newAlbums = [
                    ...state.albums.slice(0, index),
                    album,
                    ...state.albums.slice(index + 1)
                ];
            }
            return {
                loading: false,
                error: false,
                indexByIdMap: indexByIdMap,
                albums: newAlbums
            };
        }
        // case Action.POST_COMMENT_CREATE_REQUEST: {
        //     const index = state.indexByIdMap[action.albumId];
        //     state.albums[index].photoCreateRequest = true;
        //     state.albums[index].photoCreateError = false;
        //
        //     return {
        //         ...state
        //     };
        // }
        // case Action.POST_COMMENT_CREATE_FAILURE: {
        //     const index = state.indexByIdMap[action.albumId];
        //     state.albums[index].photoCreateRequest = false;
        //     state.albums[index].photoCreateError = true;
        //
        //     return {
        //         ...state
        //     };
        // }
        default:
            return state;
    }
}
