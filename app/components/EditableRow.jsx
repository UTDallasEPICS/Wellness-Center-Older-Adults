import React from 'react';

const EditableRow = ({ editFormData, handleEditFormChange, handleCancelClick, status }) => {
  return (
    <tr className="bg-gray-200">
      <td className="p-2">
        <textarea
          className="w-full p-1 h-20 border border-gray-300 rounded-sm box-border resize-y block mx-auto text-center font-sans"
          type="text"
          name="clientName"
          required="required"
          placeholder="Enter client's name..."
          value={editFormData.clientName}
          onChange={handleEditFormChange}
        ></textarea>
      </td>

      <td className="p-2">
        <textarea
          className="w-full p-1 h-20 border border-gray-300 rounded-sm box-border resize-y block mx-auto text-center font-sans"
          type="text"
          name="phoneNumber"
          required="required"
          placeholder="Enter contact number..."
          value={editFormData.phoneNumber}
          onChange={handleEditFormChange}
        ></textarea>
      </td>

      <td className="p-2">
        <textarea
          className="w-full p-1 h-20 border border-gray-300 rounded-sm box-border resize-y block mx-auto text-center font-sans"
          type="text"
          name="address"
          required="required"
          placeholder="Enter client's address"
          value={editFormData.address}
          onChange={handleEditFormChange}
        ></textarea>
      </td>

      <td className="p-2">
        <textarea
          className="w-full p-1 h-20 border border-gray-300 rounded-sm box-border resize-y block mx-auto text-center font-sans"
          type="text"
          name="startTime"
          required="required"
          placeholder="Enter time of pick-up..."
          value={editFormData.startTime}
          onChange={handleEditFormChange}
        ></textarea>
      </td>

      {status === "Reserved" || status === "Completed" ? (
        <td className="p-2">
          <textarea
            className="w-full p-1 h-20 border border-gray-300 rounded-sm box-border resize-y block mx-auto text-center font-sans"
            type="text"
            name="volunteerName"
            placeholder="Enter volunteer name"
            value={editFormData.volunteerName}
            onChange={handleEditFormChange}
          ></textarea>
        </td>
      ) : null}

      <td className="text-center">
        <button
          className="text-white bg-green-600 border-none p-2 m-1 rounded-md cursor-pointer transition duration-300 hover:bg-green-700"
          type="submit"
        >
          <span className="material-symbols-rounded">done</span>
        </button>
        <button
          className="text-white bg-red-500 border-none p-2 m-1 rounded-md cursor-pointer transition duration-300 hover:bg-red-700"
          type="button"
          onClick={handleCancelClick}
        >
          <span className="material-symbols-rounded">cancel</span>
        </button>
      </td>
    </tr>
  );
};

export default EditableRow;