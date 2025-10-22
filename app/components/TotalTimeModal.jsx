import React, { useState, useEffect } from 'react';

/**
 * A modal component for inputting a drive duration in hours and minutes.
 * * @param {object} props - Component properties.
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Function to call when closing/cancelling the modal.
 * @param {function} props.onSave - Function to call when saving the time. 
 * Receives { hours, minutes, notes, totalMinutes }.
 */
const TotalTimeModal = ({ isOpen, onClose, onSave }) => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(30);
    const [notes, setNotes] = useState('');
    const [error, setError] = useState(false);

    // Reset state whenever the modal opens
    useEffect(() => {
        if (isOpen) {
            setHours(0);
            setMinutes(30);
            setNotes('');
            setError(false);
        }
    }, [isOpen]);

    // Handle input changes with built-in validation
    const handleMinutesChange = (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 0) {
            value = 0;
        } else if (value > 59) {
            value = 59; // Cap minutes at 59
        }
        setMinutes(value);
    };

    const handleHoursChange = (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 0) {
            value = 0;
        }
        setHours(value);
    };

    const handleSave = () => {
        // 1. Validation Check: Ensure duration is greater than zero
        if (hours === 0 && minutes === 0) {
            setError(true);
            return;
        }

        // 2. Prepare Data
        const totalMinutes = (hours * 60) + minutes;
        const driveData = { 
            hours, 
            minutes, 
            notes: notes.trim(), 
            totalMinutes 
        };

        // 3. Execute Save Callback
        onSave(driveData);

        // 4. Close Modal
        onClose(); 
    };

    // If the modal is not open, return null to render nothing
    if (!isOpen) {
        return null;
    }

    return (
        // Modal Overlay (Fixed, full screen, dark background)
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            // Close modal if user clicks on the overlay background
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* Modal Content Box */}
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm relative">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-semibold text-gray-800">How long was the drive? 🚗</h2>
                    <button 
                        className="text-gray-400 hover:text-gray-600 text-2xl" 
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>

                {/* Error Message */}
                <div 
                    className={`text-red-500 text-sm mb-4 text-center ${error ? 'block' : 'hidden'}`}
                >
                    Please enter a duration greater than zero.
                </div>

                {/* Time Inputs Group */}
                <div className="flex justify-between items-end mb-6">
                    
                    {/* Hours Field */}
                    <div className="flex-1 px-2 text-center">
                        <label htmlFor="hours" className="block text-sm font-medium text-gray-600 mb-2">Hours</label>
                        <input
                            type="number"
                            id="hours"
                            value={hours}
                            min="0"
                            max="99"
                            onChange={handleHoursChange}
                            className="w-24 p-3 text-xl text-center border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            autoFocus
                        />
                    </div>
                    
                    {/* Separator */}
                    <span className="text-4xl text-gray-400 pb-1">:</span>
                    
                    {/* Minutes Field */}
                    <div className="flex-1 px-2 text-center">
                        <label htmlFor="minutes" className="block text-sm font-medium text-gray-600 mb-2">Minutes</label>
                        <input
                            type="number"
                            id="minutes"
                            value={minutes}
                            min="0"
                            max="59"
                            onChange={handleMinutesChange}
                            className="w-24 p-3 text-xl text-center border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-600 mb-2">Notes (Optional)</label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g., Heavy traffic near the city or detours taken."
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-lg resize-y focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                    <button 
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 transition duration-150" 
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button 
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition duration-150" 
                        onClick={handleSave}
                    >
                        Save Time
                    </button>
                </div>

            </div>
        </div>
    );
};

export default TotalTimeModal;