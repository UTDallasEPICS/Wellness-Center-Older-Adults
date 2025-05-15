import React from "react";

const ReadOnlyVolunteerRow = ({ contact, handleEditClick, handleDeleteClick }) => {
  return (
    <tr>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
        {contact.firstName}
      </td>

      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
        {contact.lastName}
      </td>

      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
        {contact.email}
      </td>

      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
        {contact.phone}
      </td>
      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
        {contact.status}
      </td>

      <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
        <button
          className="text-white bg-green-700 cursor-pointer border-none mx-1 px-4 py-2 rounded-md transition duration-300 hover:bg-green-800"
          type="button"
          onClick={() => handleEditClick(contact)}
        >
         <span className="material-symbols-rounded">edit</span>
        </button>
        <button
          className="text-white bg-red-700 cursor-pointer border-none mx-1 px-4 py-2 rounded-md transition duration-300 hover:bg-red-800"
          type="button"
          onClick={() => handleDeleteClick(contact.id)} // Ensure you are passing contact.id
        >
          <span className="material-symbols-rounded">delete</span>
        </button>
      </td>
    </tr>
  );
};

export default ReadOnlyVolunteerRow;