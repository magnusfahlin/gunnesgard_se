import React from "react";
import PropTypes from "prop-types";
import Text from "../../Common/Text";

const Album = props => {
  let comments;
  let commentEditor;
  let commentCreateError;

  return (
    <div className="blogPost">
      <div className="title">{props.title}</div>
        <Text text={props.text} />
        <div className="author">
          av {props.createdBy}, {props.location} {props.createdAt}
        </div>
      <div>{comments}</div>
      {commentCreateError}
      {commentEditor}
      <hr />
    </div>
  );
};

Album.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  createdBy: PropTypes.string,
   // eslint-disable-next-line react/no-typos
  location: PropTypes.location,
   // eslint-disable-next-line react/no-typos
  createdAt: PropTypes.date
};

export default Album;
