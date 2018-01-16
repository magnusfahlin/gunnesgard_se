import React, { Component } from "react";
import PasswordEditor from "./PasswordEditor"
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as passwordActions from "../../actioncreators/password";

const PasswordEditorContainer = (props) => <PasswordEditor {...props}/>;
  
function mapStateToProps(state) {
  let properties = Object.assign({}, state.password);
  return Object.assign(properties, state.session);
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(passwordActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordEditorContainer);
