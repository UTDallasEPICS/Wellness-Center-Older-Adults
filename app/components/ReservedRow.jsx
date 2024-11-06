import React, {useState} from "react";
import CancelRidesModel from "/app/components/CancelRidesModel.jsx"

const ReservedRow = ({ contact, handleCancelClick, status }) => {


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
          className="text-white bg-[#419902] cursor-pointer border-none mx-1 px-4 py-2 rounded-md transition duration-300 hover:bg-[#2b6701]"
          type="button"
          onClick={handleButtonClick}
        >
          <span className="material-symbols-rounded">Cancel</span>
        </button>
      </td>

      {isCancelModelOpen && (
        <CancelRidesModel
          handleConfirmCancel={() => handleConfirmCancel(contact.id)}
          handleDenyCancel = {handleDenyCancel}
          
        />
      )}
    </tr>
  );
};

export default ReservedRow;
