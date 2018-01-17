import React, { Component } from "react";
import PropTypes from "prop-types";
import "./PasswordEditor.css";
import Spinner from "../Common/Spinner";
import ErrorMessage from "../Common/ErrorMessage";

class PasswordEditor extends React.Component {
  constructor(props) {
    super(props);

    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.handleClick = this.handlePasswordInput.bind(this);
    this.handleConfirmPasswordInput = this.handleConfirmPasswordInput.bind(
      this
    );

    this.state = {
      password: "",
      confirmPassword: "",
      valid: true,
      dirty: false
    };
  }

  isValid(value) {
    return value !== "" && value !== null && value.length > 5;
  }
  handlePasswordInput(event) {
    const value = event.target.value;
    let valid = this.isValid(value) && value === this.state.confirmPassword;

    this.setState({
      password: value,
      valid: valid,
      dirty: true
    });
  }
  handleConfirmPasswordInput(event) {
    const value = event.target.value;
    let valid = this.isValid(value) && value === this.state.password;

    this.setState({
      confirmPassword: value,
      valid: valid,
      dirty: true
    });
  }
  render() {
    let error;
    if (this.props.error) {
      error = <ErrorMessage message="Det gick inte att uppdatera lösenordet" />;
    }

    if (this.props.loading) {
      return (
        <div className="PasswordEditor">
          <Spinner />
        </div>
      );
    }

    return (
      <div className="PasswordEditor">
        <table>
        <tr>
        <td>{"Användarnamn:"}</td>
        <td><input classname="input-readonly" type="text" value={this.props.username} name="username" readonly/></td>
        </tr>
          <tr>
            <td>Ändra lösenord:</td>
            <td>
              <input
                class={this.state.valid ? "" : "invalid-input"}
                name="password"
                placeholder="minst 6 tecken"
                errorMessage="Password is required"
                onChange={this.handlePasswordInput}
                type="password"
              />
            </td>
          </tr>
          <tr>
            <td>Bekräfta lösenordet</td>
            <td>
              <input
                class={this.state.valid ? "" : "invalid-input"}
                ref="confirmPassword"
                name="confirmPassword"
                placeholder="minst 6 tecken"
                errorMessage="Passwords do not match"
                onChange={this.handleConfirmPasswordInput}
                type="password"
              />
            </td>
          </tr>
        </table>
        <div>
          {error}
          <button
            className="save"
            type="button"
            disabled={!this.state.dirty || !this.state.valid}
            onClick={() =>
              this.props.actions.updateUserPassword(
                this.props.userId,
                this.state.password,
                this.props.token
              )
            }
          >
            Spara
          </button>
        </div>
      </div>
    );
  }
}

export default PasswordEditor;
