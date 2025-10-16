// components/TotalTimeModal.js
import React, { useState } from "react";

export default function TotalTimeModal({ show, onClose, onSave, ride }) {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  const handleSave = () => {
    // Basic validation to ensure numbers are entered
    if (hours === "" || minutes === "") {
      alert("Please enter both hours and minutes.");
      return;
    }

    // Format the time as "HH:MM" with leading zeros
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const totalTime = `${formattedHours}:${formattedMinutes}`;

    onSave(ride.id, totalTime);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="p-8 bg-white rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Enter Total Ride Time</h2>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="shadow appearance-none border rounded w-16 py-2 px-3 text-gray-700"
            placeholder="HH"
            min="0"
          />
          <span>:</span>
          <input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="shadow appearance-none border rounded w-16 py-2 px-3 text-gray-700"
            placeholder="MM"
            min="0"
            max="59"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-[#65b037] hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}