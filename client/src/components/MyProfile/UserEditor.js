import React, { Component } from "react";
import PropTypes from "prop-types";
import "./UserEditor.css";
import Spinner from "../Common/Spinner";
import ErrorMessage from "../Common/ErrorMessage";

class UserEditor extends React.Component {
  constructor(props) {
    super(props);

    this.handleFieldChange = this.handleFieldChange.bind(this);

    this.state = {
      dirty: false
    };
  }

  handleFieldChange(event) {
    // const value = event.target.value;
    // let valid = this.isValid(value) && value === this.state.confirmPassword;
    // this.setState({
    //   password: value,
    //   valid: valid,
    //   dirty: true
    // });
  }
  render() {
    let fields = [
      {
        description: "Namn",
        field: "name"
      },
      {
        description: "Efternamn",
        field: "surname"
      },
      {
        description: "Adress",
        field: "address"
      },
      {
        description: "Postnummer",
        field: "zipCode"
      },
      {
        description: "Ort",
        field: "town"
      },
      {
        description: "Land",
        field: "country"
      },
      {
        description: "E-post",
        field: "email"
      },
      {
        description: "Fast telefon",
        field: "homePhone"
      },
      {
        description: "Mobiltelefon",
        field: "cellPhone"
      }
    ];

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

    const tableContent = fields.map(field => (
      <tr>
        <td>{field.description + ":"}</td>
        <td>
          <input type="text" onChange={this.handleFieldChange(field.name)} />
        </td>
      </tr>
    ));

    return (
      <div className="UserEditor">
        <table>{tableContent}</table>
        <div className="save-row">
          <div className="message">{error}</div>
          <button
            className="save"
            type="button"
            disabled={!this.state.dirty}
            onClick={() =>
              this.props.actions.updateUserPassword(
                this.props.userId,
                this.props.password,
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

export default UserEditor;
