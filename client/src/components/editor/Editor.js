import React, { Component } from "react";
import PropTypes from "prop-types";
import * as postsActions from "../../actioncreators/posts.js";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      text: "",
      location: ""
    };
  }

  render() {
    return (
      <div className="editor">
        <span className="title">Skriv Inlägg</span>
        <div className="editorTopic">
          <span>Rubrik</span>
          <input onChange={event => this.setState({ title: event.target.value })} type="text"/>
        </div>
        <div className="editorPost">
          <textarea onChange={event => this.setState({ text: event.target.value })} type="text" />
        </div>
        <div className="editorLocation">
          <span>Plats</span>
          <input onChange={event => this.setState({ location: event.target.value })} type="text"/>
        </div>
        <button onClick={() =>
            this.props.actions.createPost(
              this.props.username,
              this.state.title,
              this.state.text,
              this.state.location
            )}
          className="editorLocation"
        >
          Skriv
        </button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    posts: state.posts.posts,
    username: state.authentication.username,
    userId: state.authentication.userId,
    showAddComment: state.postViewer.showAddComment,
    showComments: state.postViewer.showComments
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(postsActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
