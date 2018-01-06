import React from "react";
import Post from "./Post";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as postActions from "../../../actioncreators/post.js";

const PostContainer = (props) => <Post {...props} />;

function mapStateToProps(state, props) {
  let properties = Object.assign({}, state.posts.posts.byId[props.id]);
  return Object.assign(properties, state.session);
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(postActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostContainer);
