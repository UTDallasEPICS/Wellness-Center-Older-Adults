import React, { useState } from "react";
import CancelRidesModel from "/app/components/CancelRidesModel.jsx"

const ViewOnlyRow = ({ contact, handleEditClick, handleDeleteClick, status }) => {
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
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
        {contact.clientName}
      </td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
        {contact.phoneNumber}
      </td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
        {contact.address}
      </td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
        {contact.startTime}
      </td>
      {status === "Reserved" || status === "Completed" ? (
        <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
          {contact.volunteerName}
        </td>
      ) : null}
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
        <button
          className={`text-white ${isReserved ? "bg-red-600" : "bg-[#419902]"} cursor-pointer border-none mx-1 px-4 py-2 rounded-md transition duration-300 hover:bg-opacity-90`}
          type="button"
          onClick={handleButtonClick}
        >
          <span className="material-symbols-rounded">
            {isReserved ? "cancel" : "reserve"}
          </span>
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
