import React from "react";
import { useRouter } from "next/navigation";

const ReadOnlyRow = ({ 
  contact, 
  handleEditClick, 
  handleDeleteClick, 
  handleReserveClick, 
  convertTime, 
  startAddress,
  isVolunteer // <-- THIS IS THE KEY PROP
}) => {
  const router = useRouter();

  // --- DEBUGGING STEP 1: Check your critical props ---
  // Open your browser's developer console and look at the output for each row.
  // This will confirm the values being used for conditional rendering.
  console.log(`Row ID: ${contact.id} | isVolunteer: ${isVolunteer} | Ride Status: ${contact.status}`);
  // ---------------------------------------------------

  const handleRowClick = () => {
    router.push(`/Dashboard/rides/ride/${contact.id}`);
  };

  const rideStatus = contact.status; 
  const isRideAvailable = rideStatus === "AVAILABLE"; 
  const showVolunteerColumn = rideStatus === "Reserved" || rideStatus === "Completed";

  return (
    <tr onClick={handleRowClick} className="cursor-pointer hover:bg-gray-100 transition-colors duration-200">
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
        {contact.customerName}
      </td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
        {contact.phoneNumber}
      </td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
        {startAddress}
      </td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
        {typeof convertTime === 'function' ? convertTime(contact.startTime) : contact.startTime}
      </td>
      
      {/* Conditionally display volunteer name column */}
      {showVolunteerColumn ? (
        <td className="text-center bg-[#fffdf5] text-[20px] py-4 px-2 font-light">
          {contact.volunteerName}
        </td>
      ) : null}
      
      {/* ACTION BUTTONS COLUMN: The core logic */}
      <td className="text-center bg-[#fffdf5] text-[20px] py-4 px-2 font-light">
        <div className="flex justify-center">
          
          {/* PRIMARY CONDITION: Is the user a Volunteer or not? */}
          {isVolunteer ? (
            // VOLUNTEER VIEW
            isRideAvailable ? (
              // Display RESERVE button if the ride status is AVAILABLE
              <button
                className="text-white bg-blue-500 cursor-pointer border-none mx-1 px-4 py-2 rounded-md transition duration-300 hover:bg-blue-700"
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleReserveClick(contact.id);
                }}
              >
                Reserve Ride
              </button>
            ) : (
              // Display status text if the ride is NOT AVAILABLE
              <span className="text-gray-600 font-medium">
                {contact.status}
              </span>
            )
          ) : (
            // NON-VOLUNTEER VIEW (e.g., Admin)
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
    </tr>
  );
};

export default ReadOnlyRow;