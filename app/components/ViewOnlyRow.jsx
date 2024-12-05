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
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">{contact.customerName}</td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">{contact.customerPhone}</td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">{contact.startLocation}</td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">{contact.EndLocation}</td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">{contact.date}</td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">{contact.startTime}</td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">{contact.endTime}</td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
        <button
          className={`text-white ${isReserved ? "bg-red-600" : "bg-[#419902]"} cursor-pointer border-none mx-1 px-4 py-2 rounded-md transition duration-300 hover:bg-opacity-90`}
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
