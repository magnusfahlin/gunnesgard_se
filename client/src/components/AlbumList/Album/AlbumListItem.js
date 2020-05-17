import React from "react";
import PropTypes from "prop-types";
import Text from "../../Common/Text";
import AlbumPreview from "./AlbumPreview";
const AlbumListItem = props => {

  return (
    <div className="blogPost">
      <div className="title">{props.album.title}</div>
        <div className="author">
          av {props.album.createdBy}, {props.album.location} {props.album.createdAt}
        </div>
      <div><AlbumPreview album={props.album} /></div>
      <hr />
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
