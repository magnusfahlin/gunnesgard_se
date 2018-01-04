import React, { Component } from "react";

const Text = props => (
  <div className="text">
    {props.text.split("\n").map((item, key) => {
      return (
        <span key={key}>
          {item}
          <br />
        </span>
      );
    })}
  </div>
);

export default Text;
