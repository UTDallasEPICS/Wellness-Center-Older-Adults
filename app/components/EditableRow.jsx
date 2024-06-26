import React from 'react'
import "app/styles/editableRow.css";
const EditableRow = ({editFormData, handleEditFormChange, handleCancelClick, status}) => {
  return(
    <tr className="editableRow">
      <td className="editableRowInput">
        <textarea className="editRowInput"
        type="text" 
        name="clientName" 
        required = "required" 
        placeholder="Enter client's name..."
        value={editFormData.clientName}
        onChange={handleEditFormChange}
        ></textarea>
      </td>

      <td className="editableRowInput"> 
        <textarea className="editRowInput"
          type="text" 
          name="phoneNumber" 
          required = "required" 
          placeholder="Enter contact number..."
          value={editFormData.phoneNumber}
          onChange={handleEditFormChange}
          >
        </textarea>
      </td>

      <td className="editableRowInput">
        <textarea className="editRowInput"
        type="text" 
        name="address"
        placeholder="Enter client's address" 
        required = "required"
        value={editFormData.address}
        onChange={handleEditFormChange}
        >
        </textarea>
      </td >

      <td className="editableRowInput">
        <textarea className="editRowInput"
        type="text" 
        name="startTime" 
        required = "required" 
        placeholder="Enter time of pick-up..."
        value={editFormData.startTime}
        onChange={handleEditFormChange}
        >
        </textarea>
      </td>

      {status === "Reserved" || status == "Completed" ? (
        <td className="editableRowInput">
          <textarea className="editRowInput"
          type="text" 
          name="volunteerName" 
          required = "required" 
          placeholder="Enter volunteer name"
          value={editFormData.volunteerName}
          onChange={handleEditFormChange}
          ></textarea>
        </td>) : null}

      <td className="editRideButtonContainer">
        <button className="confirmEditButton" type="submit">
          <span className="material-symbols-rounded">done</span>
        </button>
        <button className="cancelEditButton" type="button" onClick={handleCancelClick}>
          <span className="material-symbols-rounded">cancel</span>
        </button>
      </td>
    </tr>
  );
};

export default EditableRow;
