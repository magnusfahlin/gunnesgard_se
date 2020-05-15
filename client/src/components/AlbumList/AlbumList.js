import React, { Component } from "react";
import PropTypes from "prop-types";
import AlbumContainer from "./Album/AlbumContainer.js";
import AlbumEditor from "./Editor.js";
import Spinner from "../Common/Spinner";
import ErrorMessage from "../Common/ErrorMessage";
import "./AlbumList.scss";

const AlbumList = props => {
  let albumEditor;
  if (props.albumCreateRequest) {
    albumEditor = <Spinner />;
  } else if (props.loggedIn) {
    albumEditor = (
      <AlbumEditor
        onCreateAlbum={(title, text, location) =>
          props.actions.createAlbum(title, text, location, props.token)
        }
      />
    );
  }

  let loading;
  if (props.loading) {
    loading = <Spinner />;
  }

  let albumItems;
  if (props.error) {
    albumItems = <ErrorMessage message="Kunde inte ladda bloggen" />;
  } else {
    albumItems = props.albums.map(album => (
      <AlbumContainer
        id={album.id}
        title={album.title}
      //  text={album.text}
        createdBy={album.createdBy}
      //  location={album.location}
     //   createdAt={album.createdAt}
       // comments={album.comments}
      />
    ));

    albumItems = [albumEditor, ...albumItems, loading];

    if (props.albumCreateError) {
      albumItems = [
        <ErrorMessage message="Kunde ladda upp inlägget" />,
        ...albumItems
      ];
    }
  }

  return <div className="blogAlbums">{albumItems}</div>;
};

export default AlbumList;
