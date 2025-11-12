import React from 'react';

const EditableRow = ({ 
    editFormData, 
    handleEditFormChange, 
    handleCancelClick, 
    status,
    userRole = "ADMIN" 
}) => {
    const isAdmin = userRole === "ADMIN";
    const showVolunteerColumn = status === "Reserved" || status === "Completed";
    
    const formatTimeForInput = (timeString) => {
        if (!timeString) return '';
        if (timeString.length === 5) return timeString;
        if (timeString.length >= 5) return timeString.slice(0, 5);
        return timeString;
    };

    return (
        <tr className="bg-white hover:bg-gray-100 transition-colors duration-200">
            {/* Checkbox column for admin */}
            {isAdmin && (
                <td className="p-2 text-center w-12">
                    <input
                        type="checkbox"
                        disabled
                        className="h-5 w-5 rounded border-gray-300 text-[#419902] opacity-50 cursor-not-allowed"
                    />
                </td>
            )}

            {/* Client Name & Date combined column */}
            <td className="p-2">
                <input
                    className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    type="text"
                    name="customerName"
                    placeholder="Enter client's Name..."
                    value={editFormData.customerName || ''}
                    onChange={handleEditFormChange}
                />
                <input
                    className="w-full p-2 mt-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans text-sm"
                    type="date"
                    name="date"
                    value={editFormData.date || ''}
                    onChange={handleEditFormChange}
                />
            </td>

            {/* Contact Number */}
            <td className="p-2">
                <input
                    className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    type="text"
                    name="phoneNumber"
                    placeholder="Enter contact number..."
                    value={editFormData.phoneNumber || ''}
                    onChange={handleEditFormChange}
                />
            </td>

            {/* Address */}
            <td className="p-2">
                <input
                    className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    type="text"
                    name="startAddress"
                    placeholder="Enter start address"
                    value={editFormData.startAddress || ''}
                    onChange={handleEditFormChange}
                />
            </td>

            {/* Pick-up Time */}
            <td className="p-2">
                <input
                    className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    type="time"
                    name="startTime"
                    value={formatTimeForInput(editFormData.startTime || editFormData.pickupTime || '')}
                    onChange={handleEditFormChange}
                />
            </td>

            {/* Wait Time column */}
            <td className="p-2">
                <input
                    className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    type="number"
                    step="0.25"
                    min="0"
                    name="waitTime"
                    placeholder="e.g., 0.5"
                    value={editFormData.waitTime ?? ''}
                    onChange={handleEditFormChange}
                />
            </td>

            {/* Volunteer Name (conditional) */}
            {showVolunteerColumn && (
                <td className="p-2">
                    <input
                        className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                        type="text"
                        name="volunteerName"
                        placeholder="Enter volunteer name"
                        value={editFormData.volunteerName || ''}
                        onChange={handleEditFormChange}
                    />
                </td>
            )}

            {/* Action buttons */}
            <td className="text-center p-2">
                <button
                    className="text-white bg-[#419902] border-none p-2 m-1 rounded-md cursor-pointer transition duration-300 hover:bg-[#378300]"
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