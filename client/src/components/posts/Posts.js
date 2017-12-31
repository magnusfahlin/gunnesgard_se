import React, { Component } from "react";
import PropTypes from "prop-types";
import Post from "./Post";
import PostEditor from "./PostEditor";
import Spinner from "./../spinner/Spinner";
import ErrorMessage from "./../errorMessage/ErrorMessage";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as postsActions from "../../actioncreators/posts.js";
import {
  POSTS_CREATE_SUCCESS,
  POSTS_FETCH_REQUEST,
  POSTS_FETCH_SUCCESS,
  POSTS_FETCH_FAILURE
} from "../../actionTypes";

class Posts extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.actions.fetchPosts();
  }

  render() {
    let postItems;

    if (!this.props.loading && !this.props.error) {
      postItems = this.props.posts.byId.map(postId => {
        let post = this.props.posts.byHash[postId];
        return (
          <Post
            _id={post._id}
            title={post.title}
            text={post.text}
            userName={post.userName}
            location={post.location}
            date={post.date}
            showAddComment={this.props.showAddComment}
            comments={post.comments}
          />
        );
      });

      let postEditor;
      if (this.props.postCreateRequest) {
        postEditor = <Spinner />;
      } else {
        postEditor = (
          <PostEditor onCreatePost={this.props.actions.createPost} />
        );
      }
      postItems = [postEditor, ...postItems];

      if (this.props.postCreateError) {
        postItems = [<ErrorMessage message="Kunde ladda upp inlägget" />, ...postItems];
      }
    } else if (this.props.loading) {
      postItems = <Spinner />;
    } else if (this.props.error) {
      postItems = <ErrorMessage message="Kunde inte ladda bloggen" />;
    } else {
      return <div />;
    }

    return <div className="blogPosts">{postItems}</div>;
  }
}

function mapStateToProps(state) {
  return Object.assign({}, state.posts);
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(postsActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
