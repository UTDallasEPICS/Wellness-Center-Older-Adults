import React from 'react';

const EditableRow = ({ editFormData, handleEditFormChange, handleCancelClick, status }) => {
    return (
        <tr className="bg-white hover:bg-gray-100 transition-colors duration-200">
            <td className="p-2">
                <input
                    className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    type="text"
                    name="clientName"
                    placeholder="Enter client's name..."
                    value={editFormData.clientName || ''}
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
                    name="address"
                    placeholder="Enter client's address"
                    value={editFormData.address || ''}
                    onChange={handleEditFormChange}
                />
            </td>

            <td className="p-2">
                <input
                    className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    type="text"
                    name="startTime"
                    placeholder="Enter time of pick-up..."
                    value={editFormData.startTime || ''}
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

            <td className="text-center p-2">
                <button
                    className="inline-flex items-center justify-center text-white bg-[#419902] border-none p-2 rounded-md cursor-pointer transition duration-300 hover:bg-green-700 hover:shadow-md"
                    type="submit"
                >
                    <span className="material-symbols-rounded">done</span>
                </button>
                <button
                    className="inline-flex items-center justify-center text-white bg-red-500 border-none p-2 rounded-md cursor-pointer transition duration-300 hover:bg-red-700 hover:shadow-md ml-2"
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