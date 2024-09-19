import React from "react";
import "/app/styles/readOnlyRow.css";
const ReadOnlyRow = ({contact, handleEditClick, handleDeleteClick, status}) => {
  return(

      <tr>
        <td className = "rideTableContent">{contact.clientName}</td>
        <td className = "rideTableContent">{contact.phoneNumber}</td>
        <td className = "rideTableContent">{contact.address}</td>
        <td className = "rideTableContent">{contact.startTime}</td>
        {status === "Reserved" || status == "Completed" ? (
        <td className = "rideTableContent">{contact.volunteerName}</td>
         ) : null}
        <td className="rideTableContent">
          <button className="rideEditButton" type="button" onClick={(event)=> handleEditClick(event, contact)}>
            <span className="material-symbols-rounded">edit</span>
          </button>
          <button className="rideDeleteButton" type="button" onClick={()=>handleDeleteClick(contact.id)}>
          <span className="material-symbols-rounded">delete</span>
          </button>
        </td>
      </tr>
  
  );
};

export default ReadOnlyRow;
