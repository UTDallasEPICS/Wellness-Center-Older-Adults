import React from "react";

const EditableVolunteerRow = ({
  editFormData,
  handleEditFormChange,
  handleCancelClick,
  handleSaveClick,
}) => {
  return (
    <tr>
      <td>
        <input
          type="text"
          name="name"
          required="required"
          placeholder="Enter name"
          value={editFormData.name}
          onChange={handleEditFormChange}
          className="border border-gray-300 rounded-md p-2"
        />
      </td>
      <td>
        <input
          type="text"
          name="phone"
          required="required"
          placeholder="Enter phone"
          value={editFormData.phone}
          onChange={handleEditFormChange}
          className="border border-gray-300 rounded-md p-2"
        />
      </td>
      <td>
        <input
          type="text"
          name="email"
          required="required"
          placeholder="Enter email"
          value={editFormData.email}
          onChange={handleEditFormChange}
          className="border border-gray-300 rounded-md p-2"
        />
      </td>
      <td>
        <button
          type="button"
          onClick={handleSaveClick}
          className="bg-green-700 p-2 text-white rounded-md" 
        >
          Save
        </button>
        <button
          type="button"
          onClick={handleCancelClick}
          className="bg-red-700 p-2 text-white rounded-md" 
        >
          Cancel
        </button>
      </td>
    </tr>
  );
};

export default EditableVolunteerRow;
