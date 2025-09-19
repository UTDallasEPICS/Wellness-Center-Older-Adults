import React from 'react';

const EditableRow = ({ editFormData, handleEditFormChange, handleCancelClick, status }) => {
    return (
        <tr className="bg-white hover:bg-gray-100 transition-colors duration-200">
            <td className="p-2">
                <input
                    className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    type="text"
                    name="customerName"
                    placeholder="Enter client's Name..."
                    value={editFormData.customerName || ''}
                    onChange={handleEditFormChange}
                />
            </td>

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

            <td className="p-2">
                <input
                    className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    type="time"
                    name="pickupTime"
                    value={editFormData.pickupTime || ''}
                    onChange={handleEditFormChange}
                />
            </td>

            {status === "Reserved" || status === "Completed" ? (
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
            ) : null}

            <td className="text-center">
                <button
                    className="text-white bg-[#419902] border-none p-2 m-1 rounded-md cursor-pointer transition duration-300 hover:bg-[#419902]"
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