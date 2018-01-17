import React, { Component } from "react";
import PropTypes from "prop-types";

class LoginEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = 
    {
      user: "",
      password: ""
    };
  }
  
  render() {
      return (
        <div>
          Logga in
          <input onChange={event => this.setState({ user: event.target.value })} type="text" name="username" />
          <input onChange={event => this.setState({ password: event.target.value })}  type="password" />
          <button
            type="button"
            onClick={() =>
              this.props.onLogin(this.state.user, this.state.password)}>
            Logga in
          </button>
        </div>
      );
    }
}

LoginEditor.propTypes = {
    onLogin: PropTypes.func
  };

export default LoginEditor;
