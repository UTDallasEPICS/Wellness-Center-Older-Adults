import React, { useState } from "react";
import CancelRidesModel from "/app/components/CancelRidesModel.jsx"
import { format } from 'date-fns';

function formatDateTime(rideDate, startTime, endTime) {
  return {
    formattedDate: format(new Date(rideDate), 'MM/dd/yyyy'),
    formattedStartTime: format(new Date(startTime), 'h:mm a'),
    formattedEndTime: format(new Date(endTime), 'h:mm a')
  };
}


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

  const { formattedDate, formattedStartTime, formattedEndTime } = formatDateTime( contact.date, contact.startTime, contact.endTime);


  return (
    <tr>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">{contact.customerName}</td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">{contact.customerPhone}</td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">{contact.startLocation}</td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light" >{contact.endLocation}</td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">{formattedDate}</td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">{formattedStartTime}</td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">{formattedEndTime}</td>
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
