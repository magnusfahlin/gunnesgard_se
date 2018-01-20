import React, { Component } from "react";
import PropTypes from "prop-types";
import Spinner from "../Common/Spinner";
import PasswordEditor from "./PasswordEditor";
import "./Password.css"

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
  } else {
    return (
      <div className="login">
        {error}
        <PasswordEditor onLogin={props.actions.login} />
      </div>
    );
  }
};

export default Login;
