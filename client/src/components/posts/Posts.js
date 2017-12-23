import React, { Component } from "react";
import PropTypes from "prop-types";
import Post from "./Post";
import Spinner from "./../spinner/Spinner";
import ErrorMessage from "./../errorMessage/ErrorMessage";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as postActions from "../../actioncreators/posts.js";
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

    if (this.props.type == POSTS_FETCH_SUCCESS && this.props.posts) {
      postItems = this.props.posts.map(post => (
        <Post
          title={post.title}
          text={post.text}
          author={post.userName}
          location={post.location}
          date={post.date}
          showAddComment={this.props.showAddComment}
        />
      ));
    } else if (this.props.type == POSTS_FETCH_REQUEST) {
      postItems = <Spinner />;
    } else if (this.props.type == POSTS_FETCH_FAILURE){
      postItems = <ErrorMessage message="Kunde inte ladda bloggen" />;
    }
    else{
      return <div></div>
    }

    return <div className="blogPosts">{postItems}</div>;
  }
}

function mapStateToProps(state) {
  return {
    type: state.posts.type,
    posts: state.posts.posts,
    showAddComment: state.postViewer.showAddComment,
    showComments: state.postViewer.showComments
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(postActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
