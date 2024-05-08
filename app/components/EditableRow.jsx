import React from "react";

const EditableRow = ({
  editFormData,
  handleEditFormChange,
  handleCancelClick,
}) => {
  return (
    <tr>
      <td>
        <input
          type="text"
          name="clientName"
          required="required"
          placeholder="Enter client's name..."
          value={editFormData.clientName}
          onChange={handleEditFormChange}
        ></input>
      </td>

      <td>
        <input
          type="text"
          name="phoneNumber"
          required="required"
          placeholder="Enter contact number..."
          value={editFormData.phoneNumber}
          onChange={handleEditFormChange}
        ></input>
      </td>

      <td>
        <input
          type="text"
          name="address"
          placeholder="Enter client's address"
          required="required"
          value={editFormData.address}
          onChange={handleEditFormChange}
        ></input>
      </td>

      <td>
        <input
          type="text"
          name="startTime"
          required="required"
          placeholder="Enter time of pick-up..."
          value={editFormData.startTime}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td>
        <button type="submit">
          <span class="material-symbols-rounded">done</span>
        </button>
        <button type="button" onClick={handleCancelClick}>
          <span class="material-symbols-rounded">cancel</span>
        </button>
      </td>
    </tr>
  );
};

export default EditableRow;
