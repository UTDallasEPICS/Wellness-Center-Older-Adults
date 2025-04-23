import React from "react";

export default function ListItemContainerVolunteer(props) {
  return (
    <div className="grid grid-cols-5 gap-100 p-4 w-full border-b border-gray-300">
      <div className="text-left text-sm font-light bg-white">
        <p>{props.clientName}</p>
      </div>
      <div className="text-left text-sm font-light bg-white">
        <p>{props.clientAddress}</p>
      </div>
      <div className="text-left text-sm font-light bg-white">
        <p>{props.pickupTime}</p>
      </div>
      <div className="text-left text-sm font-light bg-white">
        <p>{props.numHours}</p>
      </div>
      <div className="text-left text-sm font-light bg-white">
        <input type="checkbox" />
      </div>
    </div>
  );
}