import React, {Component} from "react";
import PropTypes from "prop-types";
import AlbumListItem from "./Album/AlbumListItem.js";
import Spinner from "../Common/Spinner";
import ErrorMessage from "../Common/ErrorMessage";
import "./AlbumList.scss";
import AlbumEditor from "./Editor/AlbumEditorContainer";

const AlbumList = props => {
    let albumEditor = <div/>;
    if (props.loading) {
        albumEditor = <Spinner/>;
    } else if (props.loggedIn) {
        // let albumToEdit = props.albums.find(x => x !== undefined);
        //
        // if (albumToEdit) {
        //     albumEditor = (
        //         <div>
        //             <AlbumEditor id={albumToEdit.id} token={props.token} />
        //         </div>
        //     );
        // }
    }

    let loading;
    if (props.loading) {
        loading = <Spinner/>;
    }

    let albumItems;
    if (props.error) {
        albumItems = <ErrorMessage message="Kunde inte ladda albumen"/>;
    } else {
        albumItems = props.albums.map((album, index) => (
            <div>
                <AlbumListItem album={album} token={props.token} showAlbum={props.albumsToShow.includes(album.id)}
                               toggleShowAlbum={() => props.actions.toggleShowAlbum(album.id)}/>
            </div>
        ));

        albumItems = [albumEditor, ...albumItems, loading];

        if (props.albumCreateError) {
            albumItems = [
                <ErrorMessage message="Kunde ladda upp bilden"/>,
                ...albumItems
            ];
        }
    }

    return <div className="blogAlbums">{albumItems}</div>;
};

export default AlbumList;
