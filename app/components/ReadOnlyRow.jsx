import React from "react";

const ReadOnlyRow = ({ contact, handleEditClick, handleDeleteClick, status }) => {
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
          onClick={(event) => handleEditClick(event, contact)}
        >
          <span className="material-symbols-rounded">edit</span>
        </button>
        <button
          className="text-white bg-[#419902] cursor-pointer border-none mx-1 px-4 py-2 rounded-md transition duration-300 hover:bg-[#2b6701]"
          type="button"
          onClick={() => handleDeleteClick(contact.id)}
        >
          <span className="material-symbols-rounded">delete</span>
        </button>
      </td>
    </tr>
  );
};

export default ReadOnlyRow;
