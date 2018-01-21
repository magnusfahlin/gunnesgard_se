import React, { Component } from "react";
import PropTypes from "prop-types";
import PostContainer from "./Post/PostContainer";
import PostEditor from "./Editor.js";
import Spinner from "./../Common/Spinner";
import ErrorMessage from "./../Common/ErrorMessage";
import "./PostList.css";

const PostList = props => {
  let postEditor;
  if (props.postCreateRequest) {
    postEditor = <Spinner />;
  } else if (props.loggedIn) {
    postEditor = (
      <PostEditor
        onCreatePost={(title, text, location) =>
          props.actions.createPost(title, text, location, props.token)
        }
      />
    );
  }

  let loading;
  if (props.loading) {
    loading = <Spinner />;
  }

  let postItems;
  if (props.error) {
    postItems = <ErrorMessage message="Kunde inte ladda bloggen" />;
  } else {
    postItems = props.posts.map(post => (
      <PostContainer
        id={post.id}
        title={post.title}
        text={post.text}
        createdBy={post.createdBy}
        location={post.location}
        createdAt={post.createdAt}
        comments={post.comments}
      />
    ));

    postItems = [postEditor, ...postItems, loading];

    if (props.postCreateError) {
      postItems = [
        <ErrorMessage message="Kunde ladda upp inlägget" />,
        ...postItems
      ];
    }
  }

  return <div className="blogPosts">{postItems}</div>;
};

export default PostList;
