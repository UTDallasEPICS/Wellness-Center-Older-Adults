import React from "react";

const ReadOnlyVolunteerRow = ({ contact, handleEditClick, handleDeleteClick }) => {
  return (
    <tr className="hover:bg-gray-50 transition duration-150">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {contact.firstName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {contact.lastName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {contact.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {contact.phone}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {contact.status || "AVAILABLE"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-3">
          <button
            className="text-blue-600 hover:text-blue-900 transition duration-150"
            type="button"
            onClick={() => handleEditClick(contact)}
          >
            <span className="material-symbols-rounded text-lg">edit</span>
          </button>
          <button
            className="text-red-600 hover:text-red-900 transition duration-150"
            type="button"
            onClick={() => handleDeleteClick(contact.id)}
          >
            <span className="material-symbols-rounded text-lg">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ReadOnlyVolunteerRow;