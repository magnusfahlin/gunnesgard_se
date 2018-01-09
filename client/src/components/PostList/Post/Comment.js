import React from "react";
import Text from "../../Common/Text";
import "./Comment.css"
const Comment = comment => (
  <div className="comment">
    <div className="innerComment roundCorners">
      <div>
        <Text text={comment.comment.text} />
      </div>
      <span className="bold singature">
        {comment.comment.createdBy + " , " + comment.comment.createdAt}{" "}
      </span>
    </div>
  </div>
);

export default Comment;
