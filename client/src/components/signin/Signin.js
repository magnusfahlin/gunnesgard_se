import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import * as authActions from '../../actioncreators/authentication.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import {LOGIN_SUCCESS_USER, LOGOUT_SUCCESS} from '../../actionTypes'

    let _user
    let _password;

class Signin extends React.Component {
     render() {
         if (this.props.type == LOGOUT_SUCCESS)
         {
              return(<div className='signin'>
                  Logga in
                  <input ref={input => _user = input} type="text"/>
                  <input  ref={input => _password = input} type="password"/>
                  <button type="button" onClick={() => this.props.actions.signIn(_user, _password)} >Logga in</button>
              </div>);
         }
         else{
                   return(<div className='signin'>
                  {"Välkommen " + (this.props.username? this.props.username.value : "ingen-alls")+ "!!"}
                  <button type="button" onClick={() => this.props.actions.signOut()} >Logga ut</button>
              </div>);
         }
     }
}

function mapStateToProps(state) {   
    return {
        type:  state.authentication.type,
        username:  state.authentication.username
    }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(authActions, dispatch)}
}


export default connect(mapStateToProps, mapDispatchToProps)(Signin);

