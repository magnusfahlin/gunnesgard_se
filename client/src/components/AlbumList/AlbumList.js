import React, {Component} from "react";
import PropTypes from "prop-types";
import AlbumListItem from "./Album/AlbumListItem.js";
import AlbumEditor2 from "./AlbumEditor2.js";
import Spinner from "../Common/Spinner";
import ErrorMessage from "../Common/ErrorMessage";
import "./AlbumList.scss";
import AlbumEditor from "./Editor/AlbumEditor";

const AlbumList = props => {
    let albumEditor;
    if (props.loading) {
        albumEditor = <Spinner/>;
    } else if (props.loggedIn) {
        albumEditor = (
            <div>
            <AlbumEditor album={props.albums.find(x=>x!==undefined)} token={props.token}/>
            <AlbumEditor2 {...props} /></div>
            //    onCreateAlbum={(title, text, location) =>
            //>      props.actions.createAlbum(title, text, location, props.token)
            //   }
            // />
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
                <AlbumListItem album={album} token={props.token} showAlbum={props.albumsToShow.includes(album.id)} toggleShowAlbum={() => props.actions.toggleShowAlbum(album.id)}/>
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
