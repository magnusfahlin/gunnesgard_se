import React, { Component } from "react";
import Menu from "./InnerMenu.js"
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const MenuContainer = (props) => <Menu {...props}/>;
  
function mapStateToProps(state) {
  return Object.assign({}, state.session);
}

function mapDispatchToProps(dispatch) {
  return { };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuContainer);
