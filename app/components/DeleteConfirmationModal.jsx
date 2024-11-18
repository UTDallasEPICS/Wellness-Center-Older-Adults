import React from 'react';

const DeleteConfirmationModal = ({ volunteerName, handleConfirmDelete, handleCancelDelete }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
        <p className="mb-6">Are you sure you want to delete <strong>{volunteerName}</strong>?</p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCancelDelete}
            className="bg-gray-600 text-white py-2 px-4 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            className="bg-red-600 text-white py-2 px-4 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
