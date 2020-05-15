import React from "react";
import Album from "./Album";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as postsActions from "../../../actioncreators/posts.js";

const AlbumContainer = props => <Album {...props} />;

function mapStateToProps(state, props) {
  // let properties = Object.assign({}, state.posts.posts.byId[props.id]);
  let properties = Object.assign(
    {},
    state.posts.posts[state.posts.indexByIdMap[props.id]]
  );
  return Object.assign(properties, state.session);
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(postsActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumContainer);
