import React from "react";
import AlbumEditor from "./AlbumEditor";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as albumActions from "../../../actioncreators/albums.js";

const AlbumEditorContainer = props => <AlbumEditor {...props} />;

function mapStateToProps(state, props) {

    const albumIndex = state.albums.albums.map(e => e.id).indexOf(props.id);
    const albumToEdit = state.albums.albums[albumIndex];
    let properties = Object.assign(
        {},
        {
            album: albumToEdit,
            albumModificationStatus: state.albums.albumModificationStatus[albumToEdit.id]
        }
    );
    return Object.assign(properties, state.session);
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(albumActions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumEditorContainer);
