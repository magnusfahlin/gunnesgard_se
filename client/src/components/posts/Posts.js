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

    if (!this.props.loading && !this.props.error) {
      postItems = this.props.posts.map(post => (
        <Post
          title={post.title}
          text={post.text}
          author={post.userName}
          location={post.location}
          date={post.date}
          showAddComment={this.props.showAddComment}
          showComments={this.props.showComments}
        />
      ));
    } else if (this.props.loading) {
      postItems = <Spinner />;
    } else if (this.props.error){
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
    loading: state.posts.loading,
    error: state.posts.error,
    posts: state.posts.posts,
    showAddComment: state.posts.showAddComment,
    showComments: state.posts.showComments
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(postActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Posts);