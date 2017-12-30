import React, { Component } from "react";
import PropTypes from "prop-types";
import Comment from "./../comments/Comment";
import CommentEditor from "./../comments/CommentEditor";
import Spinner from "../spinner/Spinner";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as postActions from "../../actioncreators/post.js";

class Post extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let showAddComment;
    let comments;
    let commentEditor;
    let commentCreateError;
    if (this.props.showAddComment) {
      showAddComment = <div>Kommentera</div>;
    }
    if (this.props.comments) {
      comments = this.props.comments.byId.map(id => (
        <Comment comment={this.props.comments.byHash[id]} />
      ));
    }
    if (this.props.commentCreateError) {
      commentCreateError = (
        <span className="red">Det var ett problem att ladda upp kommentaren</span>
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
        <div>{comments}</div>
        {commentCreateError}
        {commentEditor}
        <hr />
      </div>
    );
  }
}

Post.propTypes = {
  _id: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  author: PropTypes.string,
  location: PropTypes.location,
  date: PropTypes.date,
  showAddComment: PropTypes.bool
};

function mapStateToProps(state, props) {
  // let a = state.posts.posts.byHash[props._id];
  // return {commentCreateError : state.posts.posts.byHash[props._id].commentCreateError,
  //   commentCreateError : state.posts.posts.byHash[props._id].commentCreateError
  // }
  return Object.assign({}, state.posts.posts.byHash[props._id]);
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(postActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Post);
