import React, { Component } from "react";

const Comment = comment => (
  <div className="comment">
    <div className="innerComment roundCorners">
      <div>
        <span className="text">{comment.comment.text}</span>
      </div>
      <span className="bold singature">
        {comment.comment.userName + " , " + comment.comment.date}{" "}
      </span>
    </div>
  </div>
);

export default Comment;
