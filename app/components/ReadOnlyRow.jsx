import React from 'react'

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
            Edit
          </button>
          <button type="button" onClick={()=>handleDeleteClick(contact.id)}>Delete</button>
        </td>
      </tr>
  
  );
};

export default ReadOnlyRow;