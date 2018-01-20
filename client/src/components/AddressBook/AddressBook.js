import React, { Component } from "react";
import PropTypes from "prop-types";
import Spinner from "../Common/Spinner";
import ErrorMessage from "../Common/ErrorMessage";
import "./AddressBook.css"
import UserEditorContainer from "./../MyProfile/UserEditorContainer";

const AdressBook = props => {
  let addresses;
  if (props.error) {
    addresses = <ErrorMessage message="Det gick inte att ladda adressboken" />;
  } else if (props.loading) {
    addresses = <Spinner />;
  } else {
    addresses = (
      <table>
        <tr>
          <th className="nameHeader">Name</th>
          <th className="emailHeader">E-post</th>
          <th className="phoneHeader">Telefon</th>
          <th className="addressHeader">Adress</th>
        </tr>
        {props.users.map(user => {
          let phone;
          if (user.homePhone) {
            phone = <span>{user.homePhone}</span>;
          }
          if (user.cellPhone) {
            phone = [phone, <span>{user.cellPhone}</span>];
          }

          return (
            <tr>
              <td className="name">{user.name}</td>
              <td className="email">{user.email}</td>
              <td className="phone">{phone}</td>
              <td className="address">
                <span>{user.address}</span>
                <span>{`${user.zipCode} ${user.town} ${user.country}`}</span>
              </td>
            </tr>
          );
        })}
      </table>
    );
  }

  return (
    <div className="AddressBook">
    <UserEditorContainer/>
      <div className="AddressList">{addresses}</div>
    </div>
  );
};

export default AdressBook;
