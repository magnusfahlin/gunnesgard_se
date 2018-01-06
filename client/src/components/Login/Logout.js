import React, { Component } from "react";
import PropTypes from "prop-types";

const Logout = props => (
  <div>
    {"Välkommen " +
      (props.userName ? props.userName : "ingen-alls") +
      "!!"}
    <button type="button" onClick={() => props.onLogout()}>
      Logga ut
    </button>
  </div>
);

Logout.propTypes = {
  onLogout: PropTypes.func,
  userName: PropTypes.string
};

export default Logout;
