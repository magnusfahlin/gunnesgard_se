import React, {useEffect, useState} from "react";
import {WrappedReactPhotoGallery} from "./WrappedReactPhotoGallery";
import {CreateSecureArrayOfSrc} from "../../Common/SecureImage";
import {getApiRoot} from "../../../environmentConfig";

export const AlbumGallery = (props) => {
    const [state, setState] = useState([]);

    useEffect(() => {
        if (props.album && props.token && props.album.photos.length > 0) {
            const srcArray = props.album.photos.map(p => ({
                src: getApiRoot() + p.path,
                width: p.width,
                height: p.height,
                title: p.text
            }));
            CreateSecureArrayOfSrc(srcArray, props.token)
                .then(result => setState(result))
        }
    }, []);

    return (<div>
        <WrappedReactPhotoGallery photos={state}/>
    </div>)
}

export default AlbumGallery