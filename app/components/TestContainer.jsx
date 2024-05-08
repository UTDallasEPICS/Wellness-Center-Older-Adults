import React from "react";
import "app/styles/testContainer.css";

export default function TestContainer(props) {
  return (
    <div className="mainContainer">
      <div className="contentNumber">{props.number}</div>
      <p className="containerText">{props.text}</p>

      <div className="contentElements">{props.elements}</div>
    </div>
  );
}
