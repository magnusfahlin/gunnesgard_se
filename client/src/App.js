import React, { Component } from 'react';
import {BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import PostListContainer from './components/PostList/PostListContainer';
import Menu from './components/menu/Menu.js'
import Signin from './components/signin/Signin.js'
import Calendar from './components/calendar/Calendar.js'
import stateData from './data/initialState.json'
import PropTypes from 'prop-types';

const App = ({store}) =>
        <Router>
          <div id="App">
            <HeaderItem/>
            <div className='container'>
              <div id='left'>
                <Menu/>
              </div>
              <div id='center'>
                <Route path="/blog" component={() => <PostListContainer/>}/>
                <Route path="/(|home)" component={() =><PostListContainer/>}/> 
                <Route path="/myaccount" component={() => <PostListContainer/>}/> 
              </div>
              <div id='right'>
                <Signin/>
                <Calendar Calendar={stateData.Calendar}/>
              </div>
            </div>
          </div>
        </Router>

App.propTypes = {
    store: PropTypes.object
}


const HeaderItem = (props) => (
          <div id="header">
          <div id="header_top"></div>
          <div id="header_bottom">Gunnesgårds Internetportal</div>
        </div>)

export default App;
