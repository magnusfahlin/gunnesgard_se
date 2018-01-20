import React, { Component } from "react";
import PropTypes from "prop-types";

class CommentEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ""
    };
  }

  render() {
    return (
      <div className="comment">
        <div className="innerComment roundCorners">
          <div>
            <input
              type="text"
              placeholder="Skriv en kommentar"
              className="text"
              onChange={event => this.setState({ text: event.target.value })}
            />
          </div>
          <span className="bold singature">
            <button
              disabled={!this.state.text}
              onClick={() => {
                this.props.onCreateComment(this.state.text);
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

CommentEditor.propTypes = {
  onCreateComment: PropTypes.func
};

export default CommentEditor;
