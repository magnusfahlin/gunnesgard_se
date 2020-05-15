import React, { Component } from "react";
import AlbumList from "./AlbumList"
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as albumsActions from "../../actioncreators/albums";
import { withRouter } from 'react-router-dom';

class AlbumListContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.actions.fetchAlbums(this.props.token);
    }

    render() {
        return <AlbumList {...this.props} />;
    }
}

function mapStateToProps(state) {
    let properties = Object.assign({}, state.albums);
    return Object.assign(properties, state.session);
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(albumsActions, dispatch) };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AlbumListContainer));
