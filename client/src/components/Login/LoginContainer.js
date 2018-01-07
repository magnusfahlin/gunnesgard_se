import React, { Component } from "react";
import Login from "./Login"
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as loginActions from "../../actioncreators/login.js";

const LoginContainer = (props) => <Login {...props}/>;
  
function mapStateToProps(state) {
  let properties = Object.assign({}, state.login);
  return Object.assign(properties, state.session);
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(loginActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
