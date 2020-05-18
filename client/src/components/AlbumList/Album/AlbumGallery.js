import React, {Component} from "react";
import {WrappedReactPhotoGallery} from "./WrappedReactPhotoGallery";
import {CreateSecureArrayOfSrc} from "../../Common/SecureImage";
import {getApiRoot} from "../../../environmentConfig";

class AlbumGallery extends Component {
    state = {photos: []};


    componentDidMount() {
        if (this.props.album && this.props.token && this.props.album.photos.length > 0) {
            CreateSecureArrayOfSrc(this.props.album.photos.map(p => getApiRoot() + p.path), this.props.token)
                .then(result => this.setState({photos: result.map(obj=> ({ ...obj, width: 3, height: 4  }))}))
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.album && this.props.token && this.props.album.photos.length > 0) {
            CreateSecureArrayOfSrc(this.props.album.photos.map(p => getApiRoot() + p.path), this.props.token)
                .then(result => this.setState({photos: result.map(obj=> ({ ...obj, width: 3, height: 4 }))}))
        }
    }

    render() {
        return (
            <div>
                <WrappedReactPhotoGallery photos={this.state.photos}/>
            </div>
        )
    }
}

export default AlbumGallery