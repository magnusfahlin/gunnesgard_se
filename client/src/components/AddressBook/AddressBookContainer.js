import React, { Component } from "react";
import AddressBook from "./AddressBook"
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "./../../actioncreators/users.js";

class AddressBookContainer extends Component {
    constructor(props) {
        super(props);
  }

  componentDidMount() {
    this.props.actions.fetchUsers(this.props.token);
  }

  render() {
    return <AddressBook {...this.props} />;
  }
}

function mapStateToProps(state) {
  let properties = Object.assign({}, state.users);
  return Object.assign(properties, state.session);
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(userActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddressBookContainer);
