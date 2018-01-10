import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as modalActions from "../../actioncreators/modal.js";
import * as loginActions from "../../actioncreators/login.js";
import Modal from "./Modal";

const ModalContainer = props => <Modal {...props} />;

function getModalSpecificProps(modalType) {
  switch (modalType) {
    case "MODAL_LOGGED_OUT":
      return {
        onClose: props => {
            props.loginActions.signOut();
            props.modalActions.closeModal();
        },
        text: "Du verkar tyvärr loggats ut, \r\n logga in igen."
      };
    default:
      return { onClose: props =>  props.loginActions.closeModal() };
  }
}

function mapStateToProps(state) {
  const modalSpecificProps = getModalSpecificProps(state.modal.modalType);
  return Object.assign(Object.assign(modalSpecificProps, state.modal));
}

function mapDispatchToProps(dispatch) {
  return {
    modalActions: bindActionCreators(modalActions, dispatch),
    loginActions: bindActionCreators(loginActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalContainer);
