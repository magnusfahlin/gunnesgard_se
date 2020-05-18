import React from "react";
import PropTypes from "prop-types";
import Text from "../../Common/Text";
import {getApiRoot} from "../../../environmentConfig"
import SecureImage from "../../Common/SecureImage";
import "./AlbumListItem.scss"
import AlbumGallery from "./AlbumGallery";
import Comment from "../../PostList/Post/Comment";

const AlbumListItem = props => {

    let album = <div/>;

    if (props.showAlbum) {
        album =<AlbumGallery album={props.album} token={props.token}/>;
    }

    return (
        <div className="albumListItem">
            <div className="albumPreview">
                <SecureImage src={getApiRoot() + props.album.photos[0].thumbnailpath} token={props.token}/>
                <div className="albumListItemLegend">
                    <div className="title">{props.album.title}</div>
                    <div className="author">
                        av {props.album.createdBy}, {props.album.location} {props.album.createdAt}
                    </div>
                </div>
            </div>
            {album}
        </div>
    );
};

// AlbumListItem.propTypes = {
//   id: PropTypes.string,
//   title: PropTypes.string,
//   text: PropTypes.string,
//   createdBy: PropTypes.string,
//    // eslint-disable-next-line react/no-typos
//   location: PropTypes.location,
//    // eslint-disable-next-line react/no-typos
//   createdAt: PropTypes.date
// };

export default AlbumListItem;
