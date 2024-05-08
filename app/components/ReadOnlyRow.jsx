import React from "react";

const ReadOnlyRow = ({contact, handleEditClick, handleDeleteClick, status}) => {
  return(

      <tr>
        <td>{contact.clientName}</td>
        <td>{contact.phoneNumber}</td>
        <td>{contact.address}</td>
        <td>{contact.startTime}</td>
        {status === "Reserved" || status == "Completed" ? (
        <td>{contact.volunteerName}</td>
         ) : null}
        <td>
          <button type="button" onClick={(event)=> handleEditClick(event, contact)}>
            <span className="material-symbols-rounded">edit</span>
          </button>
          <button type="button" onClick={()=>handleDeleteClick(contact.id)}>
          <span className="material-symbols-rounded">delete</span>
          </button>
        </td>
      </tr>
  
  );
};

export default ReadOnlyRow;
