import React from 'react';

const CancelRidesModel = ({ handleConfirmCancel, handleDenyCancel}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Confirm Cancel</h2>
        <p className="mb-6">Are you sure you want to cancel ride?</p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleDenyCancel}
            className="bg-gray-600 text-white py-2 px-4 rounded-md mr-2"
          >
            No
          </button>
          <button
            type="button"
            onClick={handleConfirmCancel}
            className="bg-red-600 text-white py-2 px-4 rounded-md"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelRidesModel;
