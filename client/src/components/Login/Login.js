import React, { Component } from "react";
import PropTypes from "prop-types";
import Spinner from "../Common/Spinner";
import Logout from "./Logout";
import LoginEditor from "./LoginEditor";

const Login = props => {
  let error;
  if (props.error) {
    error = (
      <div className="error">
        Det gick inte, klicka här för att få ett nytt lösenord, eller försök
        igen.
      </div>
    );
  }
  if (props.loading) {
    return (
      <div className="login">
        <Spinner />
      </div>
    );
  } else if (props.loggedIn) {
    return (
      <div className="login">
        <Logout onLogout={props.actions.signOut} userName={props.userName} />
      </div>
    );
  } else {
    return (
      <div className="login">
        {error}
        <LoginEditor onLogin={props.actions.login} />
      </div>
    );
  }
};

export default Login;
