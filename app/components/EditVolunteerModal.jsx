import React from "react";

const EditVolunteerModal = ({
  editFormData,
  handleEditFormChange,
  handleSaveClick,
  handleCancelClick,
  errors = { firstName: '', lastName: '', email: '', phone: '' },
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
              maxLength={40}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={editFormData.lastName}  
              onChange={handleEditFormChange}
              className="w-full px-3 py-2 border rounded-md"
              maxLength={40}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={editFormData.email} 
              onChange={handleEditFormChange}
              className="w-full px-3 py-2 border rounded-md"
              maxLength={254}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={editFormData.phone}  
              onChange={handleEditFormChange}
              className="w-full px-3 py-2 border rounded-md"
              inputMode="tel"
              maxLength={20}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
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
              className="bg-[#419902] text-white py-2 px-4 rounded-md"
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