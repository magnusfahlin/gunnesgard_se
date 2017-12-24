import React, { Component } from "react";

const CommentEditor = comment => (
  <div className="comment">
    <div className="innerComment roundCorners">
      <div>
        <input placeholder="Skriv en kommentar" className="text" />
      </div>
      <span className="bold singature">
        <button>Skriv</button><button>Släng</button>
      </span>
    </div>
  </div>
);

export default CommentEditor;
