import React from "react";
import Post from "./Post";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as postsActions from "../../../actioncreators/posts.js";

const PostContainer = (props) => <Post {...props} />;

function mapStateToProps(state, props) {
  let properties = Object.assign({}, state.posts.posts.byId[props.id]);
  return Object.assign(properties, state.session);
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(postsActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostContainer);
