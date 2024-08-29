import React from "react";
import "/app/styles/listItemContainer.css";

export default function listItemContainer(props) {
  return (
    <div className="listContainer">
      <div className="clientName">
        <p>{props.clientName}</p>
      </div>
      <div className="clientAddress">
        <p>{props.clientAddress}</p>
      </div>
      <div className="clientEmail">
        <p>{props.clientEmail}</p>
      </div>
      <div className="clientPhone">
        <p>{props.clientPhone}</p>
      </div>
      <div className="clientBirthdate">
        <p>{props.clientBirthdate}</p>
      </div>
    </div>
  );
}
