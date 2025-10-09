import React, { useState } from "react";
import CancelRidesModel from "/app/components/CancelRidesModel.jsx"
import { format } from 'date-fns';

function formatDateTime(rideDate, startTime, endTime) {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid Date' : format(date, 'MM/dd/yyyy');
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'No time specified';
    
    try {
      // If timeString is just time (e.g., '14:30'), we need to combine it with a date
      let dateTime = timeString;
      if (!isNaN(Date.parse(timeString))) {
        dateTime = timeString;
      } else if (rideDate) {
        // Combine date and time if they're separate
        dateTime = `${rideDate.split('T')[0]}T${timeString}`;
      }
      const date = new Date(dateTime);
      return isNaN(date.getTime()) ? 'Invalid Time' : format(date, 'h:mm a');
    } catch (e) {
      return 'Invalid Time';
    }
  };

  return {
    formattedDate: formatDate(rideDate),
    formattedStartTime: formatTime(startTime),
    formattedEndTime: formatTime(endTime)
  };
}


const ViewOnlyRow = ({ contact, onReserve }) => {
  const [isReserved, setIsReserved] = useState(false);
  const [isCancelModelOpen, setIsCancelModelOpen] = useState(false);

  const handleDenyCancel = () => {
    setIsCancelModelOpen(false);
  };

  const handleConfirmCancel = () => {
    setIsReserved(!isReserved);
    setIsCancelModelOpen(false);
  };

  const handleButtonClick = async (event) => {
    if (isReserved) {
      setIsCancelModelOpen(true); // Show modal if cancelling
    } else {
      // Reserve the ride in the backend
      try {
        const response = await fetch(`/api/rides/${contact.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Reserved' }),
        });
        if (response.ok) {
          setIsReserved(true);
          if (onReserve) onReserve(); // Notify parent to refresh rides
        } else {
          alert('Failed to reserve ride');
        }
      } catch (err) {
        alert('Failed to reserve ride');
      }
    }
  };

  const { formattedDate, formattedStartTime, formattedEndTime } = formatDateTime(contact.date, contact.startTime, contact.endTime);

  return (
    <tr>
      <td className="text-center bg-[#fffdf5] text-[20px] py-4 px-2 font-light">{contact.customerName}</td>
      <td className="text-center bg-[#fffdf5] text-[20px] py-4 px-2 font-light">{contact.customerPhone}</td>
      <td className="text-center bg-[#fffdf5] text-[20px] py-4 px-2 font-light">{contact.startLocation}</td>
      <td className="text-center bg-[#fffdf5] text-[20px] py-4 px-2 font-light">{formattedStartTime}</td>
      <td className="text-center bg-[#fffdf5] text-[20px] py-4 px-2 font-light">
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
          handleDenyCancel={handleDenyCancel}
        />
      )}
    </tr>
  );
};

export default ViewOnlyRow;