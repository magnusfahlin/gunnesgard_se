import React, { Component } from "react";
import PropTypes from "prop-types";
import Comment from "./../comments/Comment";
import CommentEditor from "./../comments/CommentEditor";

class Post extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let showAddComment;
    let comments;
    let commentEditor;
    if (this.props.showAddComment) {
      showAddComment = <div>Kommentera</div>;
    }
    if (this.props.comments) {
      comments = this.props.comments.map((item) =>
          <Comment comment={item}/>)
    }
    commentEditor = <CommentEditor/>;
    return (
      <div className="blogPost">
        <div className="title">{this.props.title}</div>
        <div className="text">
          {this.props.text.split("\n").map((item, key) => {
            return (
              <span key={key}>
                {item}
                <br />
              </span>
            );
          })}
        </div>
        <div className="author">
          av {this.props.author}, {this.props.location} {this.props.date}
        </div>
       {showAddComment}
       <div>
        {comments}
        </div>
        {commentEditor}
        <hr />
      </div>
    );
  }
}

Post.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  author: PropTypes.string,
  location: PropTypes.location,
  date: PropTypes.date,
  showAddComment: PropTypes.bool
};

export default Post;
