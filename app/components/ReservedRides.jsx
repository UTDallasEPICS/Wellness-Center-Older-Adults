import React, {useState} from "react";
import CancelRidesModel from "/app/components/CancelRidesModel.jsx"

const ReservedRides = ({ contact, handleCancelClick, status }) => {


  const [isCancelModelOpen, setIsCancelModelOpen] = useState(false);



  const handleButtonClick = (event) => {
    setIsCancelModelOpen(true);
  };

  const handleDenyCancel = () => {
    setIsCancelModelOpen(false);
  };

  const handleConfirmCancel = (contactId) => {
    handleCancelClick(contactId);
    setIsCancelModelOpen(false);
  }





  return (
    <li key={contact.id} className="border border-gray-300 p-4 mb-4 rounded-2xl bg-white grid grid-cols-[1fr_auto] gap-2.5 items-start shadow-md">
      <div className="activity-details">
        <div className="activity-header">
          <strong>{contact.date}</strong> at {contact.time} 
        </div>
        <div><strong>Client Name:</strong> {contact.clientName}</div>
        
        <div><strong>Start Time:</strong> {contact.startTime}</div>
        <div><strong>Hours:</strong> {contact.hours}</div>               
      </div>
      <div className="activity-status-icon">


        <button
          className="text-white bg-[#419902] cursor-pointer border-none mx-1 px-4 py-2 rounded-md transition duration-300 hover:bg-[#2b6701]"
          type="button"
          onClick={handleButtonClick}
          
        >
          <span className="material-symbols-rounded">Cancel</span>
        </button>
        
      </div>

      {isCancelModelOpen && (

        <CancelRidesModel
          handleConfirmCancel={() => handleConfirmCancel(contact.id)}
          handleDenyCancel = {handleDenyCancel}

        
        />
      )}


    </li>
  );


  
};

export default ReservedRides;
