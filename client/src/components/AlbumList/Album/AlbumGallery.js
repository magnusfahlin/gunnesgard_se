import React, {Component} from "react";
import {WrappedReactPhotoGallery} from "./WrappedReactPhotoGallery";
import {CreateSecureArrayOfSrc} from "../../Common/SecureImage";
import {getApiRoot} from "../../../environmentConfig";

class AlbumGallery extends Component {
    state = {photos: []};


    componentDidMount() {
        if (this.props.album && this.props.token && this.props.album.photos.length > 0) {
            const srcArray = this.props.album.photos.map(p => ({src : getApiRoot() + p.path, width: p.width, height: p.height, title: p.text}));
            CreateSecureArrayOfSrc(srcArray, this.props.token)
                .then(result => this.setState({photos: result}))
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // if (this.props.album && this.props.token && this.props.album.photos.length > 0) {
        //     const srcArray = this.props.album.photos.map(p => ({src : getApiRoot() + p.path, width: p.width, height: p.height}));
        //     CreateSecureArrayOfSrc(srcArray, this.props.token)
        //         .then(result => this.setState({photos: result}))
        // }
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