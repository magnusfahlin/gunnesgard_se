import React, { Component } from "react";
import Post from "./Post";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as postActions from "../../../actioncreators/post.js";

const PostContainer = () => <Post {...this.props} />;

function mapStateToProps(state, props) {
  return Object.assign({}, state.posts.posts.byId[props._id]);
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(postActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Post);
