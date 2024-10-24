import React, { useState } from "react";

const ViewOnlyRow = ({ contact }) => {
  const [isReserved, setIsReserved] = useState(false);

  const handleButtonClick = () => {
    setIsReserved(!isReserved); 
  };

  return (
    <tr>
      <td>{contact.clientName}</td>
      <td>{contact.phoneNumber}</td>
      <td>{contact.address}</td>
      <td>{contact.startTime}</td>
      <td>
        <button
          className={`text-white ${isReserved ? "bg-red-600" : "bg-green-600"} cursor-pointer mx-1 px-4 py-2 rounded-md`}
          type="button"
          onClick={handleButtonClick}
        >
          {isReserved ? "Cancel" : "Reserve"}
        </button>
      </td>
    </tr>
  );
};

export default ViewOnlyRow;
