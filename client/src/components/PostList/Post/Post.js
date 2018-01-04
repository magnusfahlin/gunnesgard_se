import React, { Component } from "react";
import PropTypes from "prop-types";
import Comment from "./Comment";
import CommentEditor from ".//CommentEditor";
import ErrorMessage from "./../../errorMessage/ErrorMessage";
import Spinner from "../../spinner/Spinner";
import Text from "../../Common/Text";

class Post extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props) {
      let showAddComment;
      let comments;
      let commentEditor;
      let commentCreateError;
      if (this.props.showAddComment) {
        showAddComment = <div>Kommentera</div>;
      }
      if (this.props.comments) {
        comments = this.props.comments.byIndex.map(id => (
          <Comment comment={this.props.comments.byId[id]} />
        ));
      }
      if (this.props.commentCreateError) {
        commentCreateError = (
          <ErrorMessage message="Det var ett problem att ladda upp kommentaren" />
        );
      }

      if (this.props.commentCreateRequest) {
        commentEditor = <Spinner />;
      } else {
        commentEditor = (
          <CommentEditor
            onCreateComment={text => {
              this.props.actions.createComment(this.props._id, text);
            }}
          />
        );
      }
      return (
        <div className="blogPost">
          <div className="title">{this.props.title}</div>
          <Text text={this.props.text} />
          <div className="author">
            av {this.props.userName}, {this.props.location} {this.props.date}
          </div>
          {showAddComment}
          <div>{comments}</div>
          {commentCreateError}
          {commentEditor}
          <hr />
        </div>
      );
    }
  }
}

Post.propTypes = {
  _id: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  userName: PropTypes.string,
  location: PropTypes.location,
  date: PropTypes.date,
  showAddComment: PropTypes.bool
};

export default Post;
