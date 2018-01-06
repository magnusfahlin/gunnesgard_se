import React, { Component } from "react";
import PostList from "./PostList"
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as postsActions from "../../actioncreators/posts.js";

class PostListContainer extends Component {
    constructor(props) {
        super(props);
  }

  componentDidMount() {
    this.props.actions.fetchPosts();
  }

  render() {
    return <PostList {...this.props} />;
  }
}

function mapStateToProps(state) {
  let properties = Object.assign({}, state.posts);
  return Object.assign(properties, state.session);
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(postsActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostListContainer);
