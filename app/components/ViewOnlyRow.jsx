import React, { useState } from "react";
import CancelRidesModel from "/app/components/CancelRidesModel.jsx"

const ViewOnlyRow = ({ contact }) => {
  const [isReserved, setIsReserved] = useState(false);


  const [isCancelModelOpen, setIsCancelModelOpen] = useState(false);




  const handleDenyCancel = () => {
    setIsCancelModelOpen(false);
  };

  const handleConfirmCancel = () => {
    setIsReserved(!isReserved);
    setIsCancelModelOpen(false);
  }


  const handleButtonClick = (event) => {
    if (isReserved) {
      setIsCancelModelOpen(true); // Show modal if cancelling
    }
    else{
      setIsReserved(!isReserved);

    }
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

      {isCancelModelOpen && (
        <CancelRidesModel
          handleConfirmCancel={handleConfirmCancel}
          handleDenyCancel = {handleDenyCancel}
          
        />
      )}

    </tr>
  );
};

export default ViewOnlyRow;
