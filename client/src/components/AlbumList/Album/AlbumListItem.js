import React, {useState} from "react";
import {getApiRoot} from "../../../environmentConfig"
import SecureImage from "../../Common/SecureImage";
import "./AlbumListItem.scss"
import AlbumGallery from "./AlbumGallery";
import AlbumEditor from "../Editor/AlbumEditorContainer";

const AlbumListItem = props => {

    const [editMode, setEditMode] = useState(false);
    let album = <div/>;
    let buttonRow = <div/>;

    if (props.showAlbum) {
        buttonRow = <div className="buttonRow"><button onClick={() => setEditMode(!editMode)}>Redigera</button></div>;
        if (editMode){
            album = <AlbumEditor id={props.album.id} token={props.token} />
        } else {
            album = <AlbumGallery album={props.album} token={props.token}/>;
        }
    }

    return (
        <div className="albumListItem">
            <div className="albumPreview" onClick={() => props.toggleShowAlbum()}>
                <SecureImage src={getApiRoot() + props.album.photos[0].thumbnailPath} token={props.token}/>
                <div className="albumListItemLegend">
                    <div className="title">{props.album.title}</div>
                    <div className="author">
                        av {props.album.createdBy}, {props.album.location} {props.album.createdAt}
                    </div>
                </div>
            </div>
            {buttonRow}
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
