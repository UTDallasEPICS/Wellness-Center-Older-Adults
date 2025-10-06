import React, { useState } from 'react';

const AddTimeModal = ({ isOpen, onClose, onSave }) => {
  const [driveDuration, setDriveDuration] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    // Basic validation
    if (driveDuration.trim() === '' || isNaN(driveDuration)) {
      alert('Please enter a valid drive duration.');
      return;
    }
    // Call the parent's save handler
    onSave(driveDuration);
    setDriveDuration(''); // Clear input after save
  };

  return (
    // Backdrop
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} 
    >

      <div 
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm"
        onClick={e => e.stopPropagation()} 
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Drive Time</h3>
        
        <div className="mb-4">
          <label htmlFor="drive-duration" className="block text-sm font-medium text-gray-700 mb-2">
            How long did you drive? (in hours)
          </label>
          <input
            type="number"
            id="drive-duration"
            name="drive-duration"
            value={driveDuration}
            onChange={(e) => setDriveDuration(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 1.5"
            step="0.1"
            min="0"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-150"
          >
            Save Time
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTimeModal;