import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

const menuItems = [
  {
    topic: "Home",
    link: "/home",
    showAlways: true
  },
  {
    topic: "Blog",
    link: "/blog",
    showAlways: false
  },
  {
    topic: "Skriv inlägg",
    link: "/editor",
    showAlways: false
  },
  {
    topic: "Mina Uppgifter",
    link: "/myaccount",
    showAlways: false
  }
];

class Menu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const menu = menuItems
    .filter(item => item.showAlways || this.props.showAll)
    .map(item =>
    (<span className="menuItem">
        <Link to={item.link}>{item.topic}</Link>
      </span>
    ));
    return <div className="menu">{menu}</div>;
  }
}

function mapStateToProps(state) {
  return {
    showAll: state.menu.showAll
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
