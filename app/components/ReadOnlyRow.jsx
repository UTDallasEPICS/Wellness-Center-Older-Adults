// app/components/ReadOnlyRow.jsx
import React from "react";
import { useRouter } from "next/navigation";

const ReadOnlyRow = ({ 
    contact, 
    handleEditClick, 
    handleDeleteClick, 
    handleReserveClick, 
    status, 
    convertTime, 
    startAddress, 
    userRole = "ADMIN" // Default role for safety
}) => {
    const router = useRouter();
    
    const isVolunteer = userRole === "VOLUNTEER";
    const isAdmin = userRole === "ADMIN";
    
    // Logic to handle row click (navigation)
    const handleRowClick = () => {
        router.push(`/Dashboard/rides/ride/${contact.id}`);
    };

    // Helper to format the date to M/D/YY
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(-2)}`;
    }

    // Determine if the Volunteer Name column should be present
    const showVolunteerColumn = status === "Reserved" || status === "Completed";
    
    // Use contact.customerPhone as it's passed from the parent Page.jsx
    const contactNumber = contact.customerPhone || contact.phoneNumber;

    return (
        <tr onClick={handleRowClick} className="cursor-pointer hover:bg-gray-100 transition-colors duration-200 border-b border-gray-100">
            {/* 1. Client Name */}
            <td className="text-center bg-[#fffdf5] text-[15px] py-3 px-2 font-light text-gray-800">
                {contact.customerName}
            </td>
            
            {/* 2. Date */}
            <td className="text-center bg-[#fffdf5] text-[15px] py-3 px-2 font-light text-gray-600">
                {formatDate(contact.date)}
            </td>

            {/* 3. Time */}
            <td className="text-center bg-[#fffdf5] text-[15px] py-3 px-2 font-light text-gray-600">
                {typeof convertTime === 'function' ? convertTime(contact.startTime) : contact.startTime}
            </td>

            {/* 4. Contact Number */}
            <td className="text-center bg-[#fffdf5] text-[15px] py-3 px-2 font-light text-gray-600">
                {contactNumber}
            </td>

            {/* 5. Address (using startAddress prop which contains startLocation string) */}
            <td className="text-center bg-[#fffdf5] text-[15px] py-3 px-2 font-light text-gray-600">
                {startAddress}
            </td>
            
            {/* 6. Volunteer Name (Conditional) */}
            {showVolunteerColumn && (
                <td className="text-center bg-[#fffdf5] text-[15px] py-3 px-2 font-light text-gray-800">
                    {contact.volunteerName || 'N/A'}
                </td>
            )}
            
            {/* 7. ACTION COLUMN */}
            <td className="text-center bg-[#fffdf5] text-[15px] py-3 px-2 font-light">
                <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                    
                    {/* ADMIN: Edit and Delete buttons (Only for unreserved/available rides) */}
                    {isAdmin && (status === "Unreserved" || status === "AVAILABLE") && (
                        <>
                            <button
                                className="text-gray-500 hover:text-[#419902] mx-1 transition duration-300"
                                type="button"
                                onClick={(event) => handleEditClick(event, contact)}
                            >
                                <span className="material-symbols-rounded">edit</span>
                            </button>
                            <button
                                className="text-gray-500 hover:text-red-500 mx-1 transition duration-300"
                                type="button"
                                onClick={() => handleDeleteClick(contact.id)}
                            >
                                <span className="material-symbols-rounded">delete</span>
                            </button>
                        </>
                    )}

                    {/* VOLUNTEER: Reserve button (Only for unreserved/available rides) */}
                    {isVolunteer && (status === "Unreserved" || status === "AVAILABLE") && (
                        <button
                            className="text-white bg-green-600 cursor-pointer border-none mx-1 px-4 py-2 rounded-md transition duration-300 hover:bg-green-700"
                            type="button"
                            onClick={() => handleReserveClick(contact.id)}
                        >
                            Reserve
                        </button>
                    )}
                    
                    {/* View Details/Status for Reserved/Completed (Admin/Volunteer) */}
                    {(status === "Reserved" || status === "Completed") && (
                        <button
                            className="text-white bg-gray-500 cursor-pointer border-none mx-1 px-3 py-1 rounded-md text-sm hover:bg-gray-600"
                            type="button"
                            onClick={handleRowClick}
                        >
                            View Details
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default ReadOnlyRow;