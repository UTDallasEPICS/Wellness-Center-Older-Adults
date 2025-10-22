"use client";

import { useState, useEffect } from "react";

/**
 * A modal component for inputting a drive duration in hours and minutes.
 * @param {object} props - Component properties.
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Function to call when closing/cancelling the modal.
 * @param {function} props.onSave - Function to call when saving the time. 
 * Receives { hours, minutes, notes, totalMinutes }.
 * @param {string} props.initialDriveTime - The drive time string (e.g., "1 hr 30 min") to pre-fill.
 */
const TotalTimeModal = ({ isOpen, onClose, onSave, initialDriveTime }) => { 
    // ----------------------
    // 1. STATE MANAGEMENT
    // ----------------------
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(30);
    const [notes, setNotes] = useState('');
    const [error, setError] = useState(false);

    /**
     * Helper function to parse a time string like "1 hr 30 min" or "45 min".
     * This function MUST be defined before its usage in useEffect.
     */
    const parseDriveTime = (timeString) => {
        let h = 0;
        let m = 0;
        if (timeString) {
            // Regex to find numbers followed by "hr" or "min"
            const hourMatch = timeString.match(/(\d+)\s*hr/);
            const minuteMatch = timeString.match(/(\d+)\s*min/);
            
            if (hourMatch) {
                h = parseInt(hourMatch[1], 10);
            }
            if (minuteMatch) {
                m = parseInt(minuteMatch[1], 10);
            }
        }
        return { hours: h, minutes: m };
    };

    // Reset state and set initial drive time whenever the modal opens
    useEffect(() => {
        if (isOpen) {
            // 1. Parse the drive time from the prop
            const { hours: initialHours, minutes: initialMinutes } = parseDriveTime(initialDriveTime);
            
            // 2. Determine the final values, defaulting to 0:30 if parsing fails
            //    and ensuring minutes doesn't exceed 59.
            const newHours = initialHours > 0 || initialMinutes > 0 ? initialHours : 0;
            const newMinutes = initialHours > 0 || initialMinutes > 0 ? (initialMinutes > 59 ? 59 : initialMinutes) : 30;

            // 3. Set the state with the parsed/default values
            setHours(newHours);
            setMinutes(newMinutes);
            setNotes('');
            setError(false);
        }
    }, [isOpen, initialDriveTime]); // Dependency added for initialDriveTime

    // ----------------------
    // 2. HANDLERS & VALIDATION
    // ----------------------
    const handleMinutesChange = (e) => {
        let value = parseInt(e.target.value) || 0;
        if (value < 0) value = 0;
        else if (value > 59) value = 59; // Cap minutes at 59
        setMinutes(value);
    };

    const handleHoursChange = (e) => {
        let value = parseInt(e.target.value) || 0;
        if (value < 0) value = 0;
        setHours(value);
    };

    const handleSave = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Validation Check: Must have a duration > 0
        if (hours === 0 && minutes === 0) {
            setError(true);
            return;
        }

        // Prepare Data
        const totalMinutes = (hours * 60) + minutes;
        const driveData = { 
            hours, 
            minutes, 
            notes: notes.trim(), 
            totalMinutes 
        };

        // Execute Save Callback and close
        onSave(driveData);
        onClose(); 
    };

    // If the modal is not open, render nothing
    if (!isOpen) {
        return null;
    }

    // ----------------------
    // 3. RENDER (TAILWIND UI)
    // ----------------------
    return (
        // Modal Overlay (matches ClientInputForm overlay)
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            // Close modal if user clicks on the overlay background
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* Modal Content Box (using a form for easy submission handling) */}
            <div className="bg-white p-8 rounded-lg w-full max-w-sm relative">
                <form className="flex flex-col space-y-4" onSubmit={handleSave}>
                    
                    {/* Header and Add/Save Button (Top Right) */}
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-left font-light text-2xl">Log Drive Time 🚗</h2>
                        <button
                            type="submit"
                            className="bg-[#419902] text-white px-6 py-2.5 text-base rounded-lg cursor-pointer hover:bg-[#378300] transition duration-150"
                        >
                            Save
                        </button>
                    </div>

                    {/* Error Message */}
                    <div 
                        className={`text-red-500 text-sm mb-4 text-center ${error ? 'block' : 'hidden'}`}
                    >
                        Please enter a duration greater than zero.
                    </div>

                    {/* Time Inputs Group */}
                    <div className="flex justify-between items-end mb-4">
                        
                        {/* Hours Field */}
                        <div className="flex-1 px-2 text-center">
                            <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
                            <input
                                type="number"
                                id="hours"
                                name="hours"
                                value={hours}
                                min="0"
                                max="99"
                                onChange={handleHoursChange}
                                className="w-full p-2.5 text-lg text-center border border-gray-300 rounded-md placeholder-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                autoFocus
                            />
                        </div>
                        
                        {/* Separator */}
                        <span className="text-4xl text-gray-400 pb-1">:</span>
                        
                        {/* Minutes Field */}
                        <div className="flex-1 px-2 text-center">
                            <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 mb-2">Minutes</label>
                            <input
                                type="number"
                                id="minutes"
                                name="minutes"
                                value={minutes}
                                min="0"
                                max="59"
                                onChange={handleMinutesChange}
                                className="w-full p-2.5 text-lg text-center border border-gray-300 rounded-md placeholder-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="mb-4">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="e.g., Heavy traffic near the city or detours taken."
                            rows="2"
                            className="w-full p-2.5 text-sm border border-gray-300 rounded-md resize-y focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Cancel Button (Bottom Right) - Save is already on the top right like your example */}
                    <div className="flex justify-end mt-4">
                        <button
                            className="bg-[#e2dbd0]/70 text-gray-700 px-6 py-2.5 text-base rounded-lg cursor-pointer hover:bg-[#e2dbd0] transition duration-150"
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default TotalTimeModal;