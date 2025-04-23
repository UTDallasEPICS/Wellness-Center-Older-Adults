import React from 'react';
import PropTypes from 'prop-types';

const DeleteRideConfirmationModal = ({ rideName, onConfirm, onCancel }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75"
      onClick={handleOverlayClick}
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 id="modal-title" className="text-lg font-semibold mb-4">Confirm Delete</h2>
        <p id="modal-description" className="mb-6">
          Are you sure you want to delete the ride <strong>{rideName || 'this ride'}</strong>?
        </p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 text-white py-2 px-4 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 text-white py-2 px-4 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteRideConfirmationModal.propTypes = {
  rideName: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default DeleteRideConfirmationModal;