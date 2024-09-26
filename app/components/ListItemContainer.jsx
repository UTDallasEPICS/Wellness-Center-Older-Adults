import React from "react";

export default function listItemContainer(props) {
  return (
    <div className="w-full h-[80px] flex flex-row">
      <div className="p-[5px_68px] text-left text-sm font-light bg-white m-0">
        <p>{props.clientName}</p>
      </div>
      <div className="p-[5px_68px] text-left text-sm font-light bg-white m-0">
        <p>{props.clientAddress}</p>
      </div>
      <div className="p-[5px_68px] text-left text-sm font-light bg-white m-0">
        <p>{props.clientEmail}</p>
      </div>
      <div className="p-[5px_68px] text-left text-sm font-light bg-white m-0">
        <p>{props.clientPhone}</p>
      </div>
      <div className="p-[5px_68px] text-left text-sm font-light bg-white m-0">
        <p>{props.clientBirthdate}</p>
      </div>
    </div>
  );
}
