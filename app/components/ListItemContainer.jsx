import React from "react";
import "app/styles/listItemContainer.css";

export default function listItemContainer(props) {
  return (
    <div className="listContainer">
      <div className="clientName">
        <p>{props.clientName}</p>
      </div>
      <div className="clientID">
        <p>{props.clientId}</p>
      </div>
      <div className="rideDate">
        <p>{props.rideDate}</p>
      </div>
      <div className="clientPhone">
        <p>{props.clientPhone}</p>
      </div>
      <div className="clientAddress">
        <p>{props.clientAddress}</p>
      </div>
    </div>
  );
}
