import React, {Component} from "react";
import PropTypes from "prop-types";
import AlbumListItem from "./Album/AlbumListItem.js";
import Spinner from "../Common/Spinner";
import ErrorMessage from "../Common/ErrorMessage";
import "./AlbumList.scss";
import AlbumEditor from "./Editor/AlbumEditorContainer";

const AlbumList = props => {
    let albumEditor;
    if (props.loading) {
        albumEditor = <Spinner/>;
    } else if (props.loggedIn) {
        let ablumToEdit = props.albums.find(x => x !== undefined);
        albumEditor = (
            <div>
                <AlbumEditor
                    id={ablumToEdit.id}
                    token={props.token}
                   // loading={props.loading}
                    //uploadPhoto={(file) => props.actions.createPhoto(ablumToEdit.id, file, props.token)}
                />
            </div>
        );
    }

    let loading;
    if (props.loading) {
        loading = <Spinner/>;
    }

    let albumItems;
    if (props.error) {
        albumItems = <ErrorMessage message="Kunde inte ladda bloggen"/>;
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
                <ErrorMessage message="Kunde ladda upp inlägget"/>,
                ...albumItems
            ];
        }
    }

    return <div className="blogAlbums">{albumItems}</div>;
};

export default AlbumList;
