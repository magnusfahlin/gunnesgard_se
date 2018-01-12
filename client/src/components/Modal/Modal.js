import React from "react";
import PropTypes from "prop-types";
import "./Modal.css";

class Modal extends React.Component {
  render() {
    // Render nothing if the "show" prop is false
    if (!this.props.show) {
      return null;
    }

    return (
      <div className="modal_backdrop">
        <div className="modal">
          <div className="message">{this.props.text}</div>
          <div className="footer">
            <button onClick={() => this.props.onClose(this.props)}>Stäng</button>
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
};

export default Modal;
