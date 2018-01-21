import React, { Component } from "react";
import { Router, Route } from "react-router-dom";
import "./App.css";
import PostListContainer from "./components/PostList/PostListContainer";
import AddressBookContainer from "./components/AddressBook/AddressBookContainer";
import MyProfile from "./components/MyProfile/MyProfile";
import MenuContainer from "./components/Menu/MenuContainer";
import LoginContainer from "./components/Login/LoginContainer.js";
import Calendar from "./components/calendar/Calendar.js";
import ModalContainer from "./components/Modal/ModalContainer.js";
import stateData from "./data/initialState.json";
import PropTypes from "prop-types";
import history from "./history";

const App = ({ store }) => (
  <Router history={history}>
    <div id="App">
      <HeaderItem />
      <ModalContainer />
      <div className="container">
        <div id="left">
          <MenuContainer />
        </div>
        <div id="center">
          <Route path="/(|start)" component={() => <PostListContainer />} />
          <Route path="/adressbok" component={() => <AddressBookContainer />} />
          <Route path="/minprofil" component={() => <MyProfile />} />
        </div>
        <div id="right">
          <LoginContainer />
          <Calendar Calendar={stateData.Calendar} />
        </div>
      </div>
    </div>
  </Router>
);

App.propTypes = {
  store: PropTypes.object
};

const HeaderItem = props => (
  <div id="header">
    <div id="header_top" />
    <div id="header_bottom">Gunnesgårds Internetportal</div>
  </div>
);

export default App;
