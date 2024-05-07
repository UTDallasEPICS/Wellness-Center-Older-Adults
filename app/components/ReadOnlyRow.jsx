import React from "react";

const ReadOnlyRow = ({ contact, handleEditClick, handleDeleteClick }) => {
  return (
    <tr>
      <td>{contact.clientName}</td>
      <td>{contact.phoneNumber}</td>
      <td>{contact.address}</td>
      <td>{contact.startTime}</td>
      <td>
        <button
          type="button"
          onClick={(event) => handleEditClick(event, contact)}
        >
          <span class="material-symbols-rounded">edit</span>
        </button>
        <button type="button" onClick={() => handleDeleteClick(contact.id)}>
          <span class="material-symbols-rounded">delete</span>
        </button>
      </td>
    </tr>
  );
};

export default ReadOnlyRow;
