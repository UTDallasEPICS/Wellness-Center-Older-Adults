"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { formatDateShort, buildLocalDate } from "../utils/dateUtils";
import { toast } from 'react-toastify'; // 💡 NEW: Import toast
// Removed: import { useRouter } from "next/navigation"; 
// This import caused a compilation error in the current environment.

const ReadOnlyRow = ({ 
    contact, 
    handleEditClick, 
    handleDeleteClick, 
    handleReserveClick, 
    handleEmergencyClick, // Note: This prop is now ignored, using local handler below
    status, 
    convertTime, 
    startAddress, 
    userRole = "ADMIN",
    selected,
    onToggleSelect
}) => {
    const router = useRouter();
    
    const isVolunteer = userRole === "VOLUNTEER";
    const isAdmin = userRole === "ADMIN";
    
    const handleRowClick = () => {
        try {
            router.push(`/Dashboard/rides/ride/${contact.id}`);
        } catch (err) {
            console.error('Navigation failed:', err);
        }
    };

    const formatDate = (dateString) => formatDateShort(dateString);
    
    /**
     * Checks if the ride's pickup time is in the future AND within the next 24 hours.
     * It combines contact.date (e.g., "11/20/25") and contact.startTime (e.g., "7:50 PM") 
     * to form a complete timestamp for reliable comparison.
     * @param {object} contact - The ride object containing date and startTime properties.
     * @returns {boolean} True if the emergency button should be visible.
     */
    const isEmergencyAllowed = (contact) => {
        if (!contact.date || !contact.startTime) return false;

        const rideDate = buildLocalDate(contact.date, contact.startTime);
        if (!rideDate) return false;
        const rideTime = rideDate.getTime();

        const fullDateTimeString = `${contact.date} ${contact.startTime}`; 
        if (isNaN(rideTime)) {
            console.error("Failed to parse date string for emergency check:", fullDateTimeString);
            return false;
        }

        const now = Date.now();
        const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

        // Check 1: The ride must still be in the future (rideTime > now)
        // Check 2: The time difference must be less than 24 hours
        return rideTime > now && (rideTime - now) < twentyFourHoursInMs;
    };
    
    // 💡 NEW FUNCTION: Handle the emergency action, API call, and toast notification
    const handleEmergencyAction = async (event, rideId) => {
        event.stopPropagation();
        
        try {
            // API route call: POST /api/rides/[rideId]
            const response = await fetch(`/api/rides/${rideId}`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'emergency' }), 
            });

            if (response.ok) {
                toast.success('🚨 Emergency Alert Sent! Admins and Volunteers notified.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                const errorData = await response.json();
                toast.error(`Error: ${errorData.message || 'Server error sending alert.'}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } catch (error) {
            console.error("API call failed:", error);
            toast.error('Network error. Failed to send emergency alert.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };


    const showVolunteerColumn = status === "Reserved" || status === "Completed";
    
    const contactNumber = contact.customerPhone || contact.phoneNumber;

    return (
        <tr className="cursor-pointer hover:bg-gray-100 transition-colors duration-200 border-b border-gray-100">
            
            {/* Checkbox Column */}
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
            
            {/* Client Name + Date */}
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
            
            {/* Contact Number */}
            <td 
                className="text-center bg-[#fffdf5] text-[15px] py-3 px-2 font-light text-gray-600"
                onClick={handleRowClick}
            >
                {contactNumber}
            </td>

            {/* Address */}
            <td 
                className="text-center bg-[#fffdf5] text-[15px] py-3 px-2 font-light text-gray-600"
                onClick={handleRowClick}
            >
                {startAddress}
            </td>

            {/* Pick-up Time */}
            <td 
                className="text-center bg-[#fffdf5] text-[15px] py-3 px-2 font-light text-gray-600"
                onClick={handleRowClick}
            >
                {typeof convertTime === 'function' ? convertTime(contact.startTime) : contact.startTime}
            </td>

            {/* Wait Time Column */}
            <td 
                className="text-center bg-[#fffdf5] text-[15px] py-3 px-2 font-light text-gray-600"
                onClick={handleRowClick}
            >
                {typeof contact.waitTime === 'number' 
                    ? `${contact.waitTime} hrs` 
                    : '0 hrs'}
            </td>
            
            {/* Volunteer Name (Conditional) */}
            {showVolunteerColumn && (
                <td 
                    className="text-center bg-[#fffdf5] text-[15px] py-3 px-2 font-light text-gray-800"
                    onClick={handleRowClick}
                >
                    {contact.volunteerName || 'N/A'}
                </td >
            )}
            
            {/* ACTION COLUMN */}
            <td className="text-center bg-[#fffdf5] text-[15px] py-3 px-2 font-light"> 
                <div className="flex justify-center items-center h-full space-x-2">
                    
                    {/* ADMIN: Edit and Delete buttons */}
                    {isAdmin && (status === "Unreserved" || status === "AVAILABLE" || status === "Added"|| status === "Reserved") && (
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
                                className="text-[#fffdf5] bg-red-600 cursor-pointer border-none mx-1 px-4 py-2 rounded-md transition duration-300 hover:bg-red-700 text-sm font-medium"
                                type="button"
                                title="Delete Ride"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(contact.id);
                                }}
                            >
                                <span className="material-symbols-rounded text-xl">delete</span>
                            </button>
                            
                            {/* EMERGENCY BUTTON - Only show if within 24 hours */}
                            {isEmergencyAllowed(contact) && (
                                <button
                                    className="text-[#fffdf5] bg-yellow-600 cursor-pointer border-none mx-1 px-4 py-2 rounded-md transition duration-300 hover:bg-yellow-700 text-sm font-medium"
                                    type="button"
                                    title="Emergency"
                                    onClick={(e) => handleEmergencyAction(e, contact.id)} // 💡 USING NEW LOCAL HANDLER
                                >
                                    <span className="material-symbols-rounded text-xl">emergency</span>
                                </button>
                            )}
                        </>
                    )}

                    {/* VOLUNTEER: Reserve button */}
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
                    
                    {/* View Details for Reserved/Completed */}
                    {(status === "Completed" || status === "Reserved") && (
                        <button
                            className="text-[#fffdf5] bg-gray-500 cursor-pointer border-none mx-1 px-3 py-1 rounded-md text-sm hover:bg-gray-600 font-medium"
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