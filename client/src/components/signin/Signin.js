import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import * as authActions from "../../actioncreators/authentication.js";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { LOGIN_SUCCESS_USER, LOGOUT_SUCCESS } from "../../actionTypes";

class Signin extends React.Component {
  constructor(props) {
    super(props);

    this.state = 
    {
      user: "",
      password: ""
    };
  }
  
  render() {
    if (this.props.type == LOGOUT_SUCCESS) {
      return (
        <div className="signin">
          Logga in
          <input onChange={event => this.setState({ user: event.target.value })} type="text" />
          <input onChange={event => this.setState({ password: event.target.value })}  type="password" />
          <button
            type="button"
            onClick={() =>
              this.props.actions.signIn(this.state.user, this.state.password)}>
            Logga in
          </button>
        </div>
      );
    } else {
      return (
        <div className="signin">
          {"Välkommen " +
            (this.props.username ? this.props.username : "ingen-alls") +
            "!!"}
          <button type="button" onClick={() => this.props.actions.signOut()}>
            Logga ut
          </button>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    type: state.authentication.type,
    username: state.authentication.username
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(authActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
