import React from 'react'

const EditableRow = ({editFormData, handleEditFormChange, handleCancelClick, status}) => {
  return(
    <tr>
      <td>
        <input 
        type="text" 
        name="clientName" 
        required = "required" 
        placeholder="Enter client's name..."
        value={editFormData.clientName}
        onChange={handleEditFormChange}
        ></input>
      </td>

      <td>
        <input
          type="text" 
          name="phoneNumber" 
          required = "required" 
          placeholder="Enter contact number..."
          value={editFormData.phoneNumber}
          onChange={handleEditFormChange}
          >
        </input>
      </td>

      <td>
        <input
        type="text" 
        name="address"
        placeholder="Enter client's address" 
        required = "required"
        value={editFormData.address}
        onChange={handleEditFormChange}
        >
        </input>
      </td>

      <td>
        <input
        type="text" 
        name="startTime" 
        required = "required" 
        placeholder="Enter time of pick-up..."
        value={editFormData.startTime}
        onChange={handleEditFormChange}
        >
        </input>
      </td>

      {status === "Reserved" || status == "Completed" ? (
        <td>
          <input
          type="text" 
          name="volunteerName" 
          required = "required" 
          placeholder="Enter volunteer name"
          value={editFormData.volunteerName}
          onChange={handleEditFormChange}
          ></input>
        </td>) : null}

      <td>
        <button type="submit">Save</button>
        <button type="button" onClick={handleCancelClick}>Cancel</button>
      </td>
    </tr>
  );
};

export default EditableRow