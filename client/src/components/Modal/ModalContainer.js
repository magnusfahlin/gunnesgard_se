import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as loginActions from "../../actioncreators/login.js";
import Modal from "./Modal";

const ModalContainer = props => <Modal {...props} />;

function getModalSpecificProps(modalType) {
  switch (state.modal.type) {
    case "MODAL_LOGGED_OUT":
      return {
        onClose: props => {
          props.actions.signOut();
        }
      };
    default:
      return { onClose: () => {} };
  }
}

function mapStateToProps(state) {
  return Object.assign(getModalSpecificProps(state.modal.type), state.modal);
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(loginActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalContainer);
