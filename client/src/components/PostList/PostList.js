import React, { Component } from "react";
import PropTypes from "prop-types";
import PostContainer from "./Post/PostContainer";
import PostEditor from "./Editor.js";
import Spinner from "./../Common/Spinner";
import ErrorMessage from "./../Common/ErrorMessage";

const PostList = (props) => {
  let postEditor;
  if (props.postCreateRequest) {
    postEditor = <Spinner />;
  } else {
    postEditor = <PostEditor onCreatePost={props.actions.createPost} />;
  }

  let postItems;
  if (props.loading) {
    postItems = <Spinner />;
  } else if (props.error) {
    postItems = <ErrorMessage message="Kunde inte ladda bloggen" />;
  } else {
    if (!props.posts || props.posts.length < 1) {
      postItems = <div />;
    }
    postItems = props.posts.byIndex.map(postId => {
      let post = props.posts.byId[postId];
      return (
        <PostContainer
          id={post.id}
          title={post.title}
          text={post.text}
          userName={post.userName}
          location={post.location}
          date={post.date}
          showAddComment={props.showAddComment}
          comments={post.comments}
        />
      );
    });

    postItems = [postEditor, ...postItems];

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
