import React, { Component } from "react";
import PropTypes from "prop-types";
import Post from "./Post";
import PostEditor from "./PostEditor.js";
import Spinner from "./../spinner/Spinner";
import ErrorMessage from "./../errorMessage/ErrorMessage";

class PostList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let postEditor;
    if (this.props.postCreateRequest) {
      postEditor = <Spinner />;
    } else {
      postEditor = (
        <PostEditor onCreatePost={this.props.actions.createPost} />
      );
    }

    let postItems;
    if (this.props.loading) {
      postItems = <Spinner />;
    } else if (this.props.error) {
      postItems = <ErrorMessage message="Kunde inte ladda bloggen" />;
    } else {
      if (!this.props.posts || this.props.posts.length < 1) {
        postItems = <div />;
      }
      postItems = this.props.posts.byIndex.map(postId => {
        let post = this.props.posts.byId[postId];
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

      postItems = [postEditor, ...postItems];

      if (this.props.postCreateError) {
        postItems = [
          <ErrorMessage message="Kunde ladda upp inlägget" />,
          ...postItems
        ];
      }
    }

    return <div className="blogPosts">{postItems}</div>;
  }
}

export default PostList;
