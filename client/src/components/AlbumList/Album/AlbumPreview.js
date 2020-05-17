import React from "react";
import Text from "../../Common/Text";
import "./AlbumPreview.scss"
const AlbumPreview = props => (
    <div className="albumPreview">
        <div className="innerPreview roundCorners">
            <div>
                {props.album.photos.map((photo, i) => {
                    // Return the element. Also pass key
                    return (<Text text={photo.path} />);
                })}
            </div>
        </div>
    </div>
);

export default AlbumPreview;
