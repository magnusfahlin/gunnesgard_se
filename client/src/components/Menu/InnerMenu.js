import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./InnerMenu.css"

const menuItems = [
  {
    topic: "Start",
    link: "/",
    showAlways: true
  },
  {
    topic: "Adressbok",
    link: "/addressbook",
    showAlways: false
  },
  {
    topic: "Mina Uppgifter",
    link: "/myprofile",
    showAlways: false
  }
];

class Menu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const menu = menuItems
    .filter(item => item.showAlways || this.props.loggedIn)
    .map(item =>
    (<span className="menuItem">
        <Link to={item.link}>{item.topic}</Link>
      </span>
    ));
    return <div className="menu">{menu}</div>;
  }
}

export default Menu;
