import React from "react";
import PropTypes from "prop-types";
import Comment from "./Comment";
import CommentEditor from ".//CommentEditor";
import ErrorMessage from "./../../Common/ErrorMessage";
import Spinner from "../../Common/Spinner";
import Text from "../../Common/Text";

const Post = props => {
  let showAddComment;
  let comments;
  let commentEditor;
  let commentCreateError;
  if (props.showAddComment) {
    showAddComment = <div>Kommentera</div>;
  }
  if (props.comments) {
    comments = props.comments.byIndex.map(id => (
      <Comment comment={props.comments.byId[id]} />
    ));
  }
  if (props.commentCreateError) {
    commentCreateError = (
      <ErrorMessage message="Det var ett problem att ladda upp kommentaren" />
    );
  }

  if (props.commentCreateRequest) {
    commentEditor = <Spinner />;
  } else if (props.loggedIn) {
    commentEditor = (
      <CommentEditor
        onCreateComment={text => {
          props.actions.createComment(props.id, text, props.token);
        }}
      />
    );
  }
  return (
    <div className="blogPost">
      <div className="title">{props.title}</div>
      <Text text={props.text} />
      <div className="author">
        av {props.userName}, {props.location} {props.date}
      </div>
      {showAddComment}
      <div>{comments}</div>
      {commentCreateError}
      {commentEditor}
      <hr />
    </div>
  );
};

Post.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  userName: PropTypes.string,
  location: PropTypes.location,
  date: PropTypes.date,
  showAddComment: PropTypes.bool
};

export default Post;
