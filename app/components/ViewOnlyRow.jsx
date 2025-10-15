import React, { useState } from "react";
import CancelRidesModel from "/app/components/CancelRidesModel.jsx"
import { format } from 'date-fns';

function formatDateTime(rideDate, startTime) {
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
      return isNaN(date.getTime()) ? 'No time specified' : format(date, 'h:mm a');
    } catch (e) {
      return 'No time specified';
    }
  };

  return {
    formattedDate: formatDate(rideDate),
    formattedTime: formatTime(startTime),
  };
}


const ViewOnlyRow = ({ 
    contact, 
    handleReserveClick, // Renamed 'onReserve' to match the original prop name
    handleEditClick,    // 🔑 NEW: Required for Admin view
    handleDeleteClick,  // 🔑 NEW: Required for Admin view
    isVolunteer         // 🔑 NEW: The prop that controls the button set
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelModelOpen, setIsCancelModelOpen] = useState(false);

  const handleDenyCancel = () => setIsCancelModelOpen(false);
  const handleConfirmCancel = () => {
    setIsCancelModelOpen(false);
  };
    
  // Renamed from handleButtonClick for clarity, but keeps the same logic
  const handleReserveButtonClick = async (event) => {
    event.stopPropagation(); // Stop row click navigation
    setIsLoading(true);
    try {
      // NOTE: The volunteerID should come from the current session user, not contact
      const response = await fetch(`/api/rides/${contact.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'Reserved',
          // You must replace 'contact.volunteerID' with the logged-in user's volunteer ID
          // This value should be passed from the parent component.
          volunteerID: contact.volunteerID || null, 
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to reserve ride');
      }
      if (handleReserveClick) handleReserveClick(); // Call parent handler to refresh
    } catch (error) {
      alert('Error reserving ride: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const { formattedDate, formattedTime } = formatDateTime(contact.date, contact.pickupTime);

  // Logic for conditional rendering of buttons
  const rideStatus = contact.status; 
  const isRideAvailable = rideStatus === "AVAILABLE"; 

  return (
    <tr>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">{contact.customerName}</td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">{contact.customerPhone}</td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">{contact.address}</td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">{formattedDate}</td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">{formattedTime}</td>
      
      {/* 🔑 ACTION BUTTONS COLUMN - THE CORE FIX IS HERE */}
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
          <div className="flex justify-center">
            {isVolunteer ? (
                // VOLUNTEER VIEW
                isRideAvailable ? (
                    // Display RESERVE button if the ride status is AVAILABLE
                    <button
                        className="text-white bg-blue-500 cursor-pointer border-none mx-1 px-4 py-2 rounded-md transition duration-300 hover:bg-blue-700 disabled:opacity-60"
                        type="button"
                        onClick={handleReserveButtonClick}
                        disabled={isLoading}
                    >
                        {isLoading ? "Reserving..." : "Reserve Ride"}
                    </button>
                ) : (
                    // Display status text if the ride is NOT AVAILABLE
                    <span className="text-gray-600 font-medium">
                        {contact.status}
                    </span>
                )
            ) : (
                // ADMIN VIEW
                // Display EDIT and DELETE buttons
                <>
                    {/* Edit Button */}
                    <button
                        className="text-white bg-[#419902] cursor-pointer border-none mx-1 px-4 py-2 rounded-md transition duration-300 hover:bg-[#2b6701]"
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleEditClick(event, contact);
                        }}
                    >
                        <span className="material-symbols-rounded">edit</span>
                    </button>
                    {/* Delete Button */}
                    <button
                        className="text-white bg-red-500 cursor-pointer border-none mx-1 px-4 py-2 rounded-md transition duration-300 hover:bg-red-700"
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteClick(contact.id);
                        }}
                    >
                        <span className="material-symbols-rounded">delete</span>
                    </button>
                </>
            )}
          </div>
      </td>
      
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
          {contact.totalTime || "N/A"}
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