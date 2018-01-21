import React, { Component } from "react";
import UserEditor from "./UserEditor";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "../../actioncreators/users";

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
  let user = {};
  const sessionUserIndex = state.users.indexByIdMap[state.session.userId];
  if (sessionUserIndex !== undefined) {
    user = state.users.users[sessionUserIndex];
  }
  let properties = {
    user: user,
    loading: state.users.loading,
    error: state.users.error
  };

  return Object.assign(properties, state.session);
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(userActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  UserEditorContainer
);
