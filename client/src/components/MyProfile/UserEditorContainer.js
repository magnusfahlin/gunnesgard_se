import React, { Component } from "react";
import UserEditor from "./UserEditor"
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as passwordActions from "../../actioncreators/password";

const UserEditorContainer = (props) => <UserEditor {...props}/>;
  
function mapStateToProps(state) {
  let properties = Object.assign({}, state.password);
  return Object.assign(properties, state.session);
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(passwordActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserEditorContainer);
