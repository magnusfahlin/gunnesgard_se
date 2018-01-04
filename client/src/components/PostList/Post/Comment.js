import React, { Component } from "react";
import Text from "../../Common/Text";

const Comment = comment => (
  <div className="comment">
    <div className="innerComment roundCorners">
      <div>
        <Text text={comment.comment.text} />
      </div>
      <span className="bold singature">
        {comment.comment.userName + " , " + comment.comment.date}{" "}
      </span>
    </div>
  </div>
);

export default Comment;
