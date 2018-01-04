import React, { Component } from 'react';
import {BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import PostList from './components/PostList';
import Menu from './components/menu/Menu.js'
import Signin from './components/signin/Signin.js'
import Calendar from './components/calendar/Calendar.js'
import Editor from './components/editor/Editor.js'
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
                <Route path="/blog" component={() => <PostList/>}/>
                <Route path="/(|home)" component={() =><PostList/>}/> 
                <Route path="/myaccount" component={() => <PostList/>}/> 
                <Route path="/editor" component={() => <Editor/>}/> 
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
