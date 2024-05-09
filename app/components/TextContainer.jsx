import React from "react";
import "app/styles/textContainer.css";

export default function TextContainer(props) {
  return (
    <div className="mainContainer">
      <div className="contentNumber">{props.number}</div>
      <p className="containerText">{props.text}</p>

      <div className="contentElements">{props.elements}</div>
    </div>
  );
}
