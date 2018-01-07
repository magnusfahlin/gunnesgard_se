import React, { Component } from "react";
import PropTypes from "prop-types";

const Logout = props => (
  <div>
    {"Välkommen " +
      (props.username ? props.username : "ingen-alls") +
      "!!"}
    <button type="button" onClick={() => props.onLogout()}>
      Logga ut
    </button>
  </div>
);

Logout.propTypes = {
  onLogout: PropTypes.func,
  username: PropTypes.string
};

export default Logout;
