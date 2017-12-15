import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class Menu extends Component {
      constructor(props) {
          super(props);
      }

      render() {
          let menuItems = this.props.menu.map(item => 
              <span className='menuItem'><Link to={item.link} >{item.topic}</Link></span>);
          return (
              <div className='menu'>
                  {menuItems}
              </div>
          )
      }
}

function mapStateToProps(state) {   
    return {
        menu:  state.menu
    }
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);