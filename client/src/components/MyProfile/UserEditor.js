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
      dirty: false,
      fields: {
        name: {
          description: "Namn",
          value: "",
          type: "readonly"
        },
        surname: {
          description: "Efternamn",
          value: "",
          type: "readonly"
        },
        address: {
          description: "Adress",
          value: ""
        },
        town: {
          description: "Ort",
          value: ""
        },
        zipCode: {
          description: "Postnummer",
          value: ""
        },
        country: {
          description: "Land",
          value: ""
        },
        email: {
          description: "E-post",
          value: ""
        },
        homePhone: {
          description: "Fast telefon",
          value: ""
        },
        cellPhone: {
          description: "Fast telefon",
          value: ""
        }
      }
    };

    //  this.updateFields(this.props.user)
  }

  updateFields(entity) {
    let newState = this.state;
    if (entity.id) {
      newState.fields = this.userDataIntoFields(entity, newState.fields);
    } else {
      newState.fields = this.clearAllFields(newState.fields);
    }
    this.setState(newState);
  }

  componentWillReceiveProps(nextProps) {
    this.updateFields(nextProps.user);
  }

  handleFieldChange(event, field) {
    const value = event.target.value;
    let newState = this.state;
    newState.fields[field].value = value;
    newState.dirty = true;
    this.setState(newState);
  }

  userDataIntoFields(user, fields) {
    Object.keys(user).forEach(propName => {
      if (fields[propName]) fields[propName].value = user[propName];
    });
    return fields;
  }

  clearAllFields(fields) {
    Object.keys(fields).forEach(fieldName => {
      fields[fieldName]["value"] = "";
    });
    return fields;
  }

  fieldsToPatch(fields) {
    let patch = {};
    Object.keys(fields).forEach(fieldName => {
      patch[fieldName] = fields[fieldName].value;
    });
    return patch;
  }

  render() {
    let error;
    if (this.props.error) {
      error = <ErrorMessage message="Det gick inte att uppdatera uppgifterna" />;
    }

    if (this.props.loading) {
      return (
        <div className="UserEditor">
          <Spinner />
        </div>
      );
    }

    const tableContent = Object.keys(this.state.fields).map(fieldName => {
      let valueElement;
      const field = this.state.fields[fieldName];

      if (field.type === "readonly") {
        valueElement = <span>{field.value}</span>;
      } else {
        valueElement = (
          <input
            type="text"
            value={field.value}
            onChange={event => this.handleFieldChange(event, fieldName)}
          />
        );
      }
      return (
        <tr>
          <td>{field.description + ":"}</td>
          <td>{valueElement}</td>
        </tr>
      );
    });

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
              this.props.actions.updateUser(
                this.props.userId,
                this.fieldsToPatch(this.state.fields),
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
