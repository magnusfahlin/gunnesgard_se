import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Editor.scss";

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
      <div className="posteditor">
        <div className="innerComment roundCorners">
          Nytt inlägg
          <div className="inputContainer">
            <input
              type="text"
              placeholder="Rubrik"
              className="text titleEditor"
              onChange={event => this.setState({ title: event.target.value })}
            />
          </div>
          <div className="inputContainer">
            <textarea
              placeholder="Inlägg"
              className="text"
              onChange={event => this.setState({ text: event.target.value })}
            />
          </div>
          <div className="inputContainer">
            <input
            type="text"
              placeholder="Plats"
              className="text location"
              onChange={event =>
                this.setState({ location: event.target.value })
              }
            />
          </div>
          <span className="bold singature">
            <button
              disabled={
                !this.state.title || !this.state.text || !this.state.location
              }
              onClick={() => {
                this.props.onCreatePost(
                  this.state.title,
                  this.state.text,
                  this.state.location
                );
              }}
            >
              Skriv
            </button>
          </span>
        </div>
      </div>
    );
  }
}

Editor.propTypes = {
  onCreatePost: PropTypes.func
};

export default Editor;
