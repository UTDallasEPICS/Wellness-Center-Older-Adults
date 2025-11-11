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
    userRole = "ADMIN", // Default role for safety
    selected,
    onToggleSelect
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
        // Check if date is valid
        if (isNaN(date.getTime())) return '';
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear().toString().slice(-2);
        return `${month}/${day}/${year}`;
    }

    // UPDATED LOGIC: Only show Volunteer column if status is Reserved or Completed
    const showVolunteerColumn = status === "Reserved" || status === "Completed";
    
    const contactNumber = contact.customerPhone || contact.phoneNumber;

    return (
        <tr className="cursor-pointer hover:bg-gray-100 transition-colors duration-200 border-b border-gray-100">
            
            {/* 0. CHECKBOX COLUMN */}
            {isAdmin && (
                <td className="p-3 text-center bg-[#fffdf5] w-12" onClick={(e) => e.stopPropagation()}>
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => onToggleSelect(contact.id)} 
                        className="h-5 w-5 rounded border-gray-300 text-[#419902] focus:ring-[#419902]"
                    />
                </td>
            )}
            
            {/* 1. Client Name + Date (Combined for display) */}
            <td 
                className="text-center bg-[#fffdf5] text-[15px] py-3 px-2 font-light text-gray-800"
                onClick={handleRowClick}
            >
                <div className="flex flex-col items-center">
                    <span className="font-semibold">{contact.customerName}</span>
                    <span className="text-sm font-normal text-gray-500">
                        {formatDate(contact.date)}
                    </span>
                </div>
            </td>
            
            {/* 2. Contact Number */}
            <td 
                className="text-center bg-[#fffdf5] text-[15px] py-3 px-2 font-light text-gray-600"
                onClick={handleRowClick}
            >
                {contactNumber}
            </td>

            {/* 3. Address (using startAddress prop which contains startLocation string) */}
            <td 
                className="text-center bg-[#fffdf5] text-[15px] py-3 px-2 font-light text-gray-600"
                onClick={handleRowClick}
            >
                {startAddress}
            </td>

            {/* 4. Pick-up Time */}
            <td 
                className="text-center bg-[#fffdf5] text-[15px] py-3 px-2 font-light text-gray-600"
                onClick={handleRowClick}
            >
                {typeof convertTime === 'function' ? convertTime(contact.startTime) : contact.startTime}
            </td>
            
            {/* 5. Volunteer Name (Conditional) */}
            {/* This cell will only render if the status is Reserved or Completed */}
            {showVolunteerColumn && (
                <td 
                    className="text-center bg-[#fffdf5] text-[15px] py-3 px-2 font-light text-gray-800"
                    onClick={handleRowClick}
                >
                    {contact.volunteerName || 'N/A'}
                </td>
            )}
            
            {/* 6. ACTION COLUMN */}
            <td className="text-center bg-[#fffdf5] text-[15px] py-3 px-2 font-light"> 
                <div className="flex justify-center items-center h-full space-x-2">
                    
                    {/* ADMIN: Edit and Delete buttons (Only for unreserved/available/added rides) */}
                    {isAdmin && (status === "Unreserved" || status === "AVAILABLE" || status === "Added") && (
                        <>
                            <button
                                className="text-[#fffdf5] bg-green-600 cursor-pointer border-none mx-1 px-4 py-2 rounded-md transition duration-300 hover:bg-green-700 text-sm font-medium"
                                type="button"
                                title="Edit Ride"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleEditClick(event, contact);
                                }}
                            >
                                <span className="material-symbols-rounded text-xl">edit</span>
                            </button>
                            <button
                                className="text-[#fffdf5] bg-green-600 cursor-pointer border-none mx-1 px-4 py-2 rounded-md transition duration-300 hover:bg-green-700 text-sm font-medium"
                                type="button"
                                title="Delete Ride"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(contact.id);
                                }}
                            >
                                <span className="material-symbols-rounded text-xl">delete</span>
                            </button>
                        </>
                    )}

                    {/* VOLUNTEER: Reserve button (Only for unreserved/available/added rides) */}
                    {isVolunteer && (status === "Unreserved" || status === "AVAILABLE" || status === "Added") && (
                        <button
                            className="text-[#fffdf5] bg-green-600 cursor-pointer border-none mx-1 px-4 py-2 rounded-md transition duration-300 hover:bg-green-700 text-sm font-medium"
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleReserveClick(contact.id);
                            }}
                        >
                            Reserve
                        </button>
                    )}
                    
                    {/* View Details/Status for Reserved/Completed (Admin/Volunteer) */}
                    {(status === "Reserved" || status === "Completed") && (
                        <button
                            className="text-[#fffdf5] bg-green-600 cursor-pointer border-none mx-1 px-3 py-1 rounded-md text-sm hover:bg-gray-600 font-medium"
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation(); 
                                handleRowClick();
                            }}
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