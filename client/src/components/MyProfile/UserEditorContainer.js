import React, { Component } from "react";
import UserEditor from "./UserEditor";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "../../actioncreators/user";

class UserEditorContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.actions.fetchUser(this.props.userId, this.props.token);
  }

  render() {
    return <UserEditor {...this.props} />;
  }
}

function mapStateToProps(state) {
  let properties = Object.assign({}, state.user);
  return Object.assign(properties, state.session);
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(userActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  UserEditorContainer
);
