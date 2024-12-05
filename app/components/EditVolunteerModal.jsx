import React from "react";

const EditVolunteerModal = ({
  editFormData,
  handleEditFormChange,
  handleSaveClick,
  handleCancelClick,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-[400px] z-60">
        <h2 className="text-lg font-semibold mb-4">Edit Volunteer</h2>
        <form onSubmit={handleSaveClick}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={editFormData.firstName}  
              onChange={handleEditFormChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={editFormData.lastName}  
              onChange={handleEditFormChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={editFormData.email} 
              onChange={handleEditFormChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={editFormData.phone}  
              onChange={handleEditFormChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCancelClick}
              className="bg-red-600 text-white py-2 px-4 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVolunteerModal;
