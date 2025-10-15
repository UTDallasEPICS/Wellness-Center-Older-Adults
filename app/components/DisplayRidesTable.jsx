import React from "react";
// Assuming ViewOnlyRow is the same component as ReadOnlyRow in your previous code
import ViewOnlyRow from "./ViewOnlyRow"; 

const DisplayRidesTable = ({ 
    ridesData, 
    onReserve,         // Existing prop for the reserve action
    isVolunteer,       // 🔑 NEW: Accept the isVolunteer prop
    convertTime,       // 🔑 NEW: Accept the convertTime utility prop
    startAddress       // 🔑 NEW: Accept the startAddress utility prop
}) => {

    // --- Placeholder Handlers for Admin actions (required by ReadOnlyRow/ViewOnlyRow signature) ---
    // Since this table is for Volunteers, these are placeholders and won't be used.
    const handleEditClick = (event, contact) => { console.warn("Edit not available on this volunteer page."); };
    const handleDeleteClick = (id) => { console.warn("Delete not available on this volunteer page."); };
    // --- ------------------------------------------------------------------------------------------ ---

    

  return (
    <div className="mt-[5%] ml-[calc(5%-20px)] w-[90%] text-left rounded-lg border border-gray-300 p-6 bg-[#fffdf5]">
      <h2 className="text-center text-[1.2rem] font-light text-gray-500 mt-4 mb-2">
        Available Rides
      </h2>
      <div className="border-b-[3px] border-gray-600 w-[20%] mx-auto mb-2 mt-[-10px]"></div>

      <table className="border-collapse w-full">
        <thead>
          <tr>
          <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Client Name</th>
          <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Contact Number</th>
          <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Address</th>
          <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Pick-up Time</th>
          <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Actions</th>
          </tr>
        </thead>

        <tbody>
          {ridesData.length > 0 ? (
            ridesData.map((contact) => (
              <ViewOnlyRow
                key={contact.id}
                contact={contact}
                
                // 🔑 PASS THE HANDLERS REQUIRED BY ReadOnlyRow/ViewOnlyRow
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
                handleReserveClick={onReserve} // Renamed prop to match ReadOnlyRow signature
                
                // 🔑 PASS THE UTILITIES REQUIRED BY ReadOnlyRow/ViewOnlyRow
                convertTime={convertTime}
                startAddress={startAddress}

                // 🔑 THE CRITICAL FIX: Pass the isVolunteer prop
                isVolunteer={isVolunteer} 
              />
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-4">
                No rides available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayRidesTable;