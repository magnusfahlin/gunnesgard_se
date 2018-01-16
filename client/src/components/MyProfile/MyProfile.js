import React, { Component } from "react";
import PropTypes from "prop-types";
import PasswordEditorContainer from "./PasswordEditorContainer.js";
import UserEditorContainer from "./UserEditorContainer.js";

const MyProfile = props => 
<div><UserEditorContainer/><PasswordEditorContainer /></div>;

export default MyProfile;
