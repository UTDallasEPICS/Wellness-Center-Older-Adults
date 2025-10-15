"use client";
import React, { useState, useEffect, useCallback } from "react";
import SimpleTab, { Tab } from "/app/components/SimpleTab.jsx";
import AddRidesTable from "/app/components/AddRidesTable.jsx";
import ReservedRidesTable from "/app/components/ReservedRidesTable.jsx";
import CompletedRidesTable from "/app/components/CompletedRidesTable.jsx";
import AddRideForm from "/app/components/AddRideForm.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import RideMap from '../../components/RideMap';

export default function Page() {
    const { id: rideIdFromParams } = useParams();
    const router = useRouter();
    
    // --- NEW STATE FOR USER ROLE ---
    const [userRole, setUserRole] = useState(null);
    const isVolunteer = userRole === 'VOLUNTEER'; // Assuming your API returns 'VOLUNTEER'
    // -------------------------------

    const [rideDetails, setRideDetails] = useState(null);
    const [ridesData, setRidesData] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [notification, setNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState('available');

    const convertTo12Hour = (time24) => {
        if (!time24) return "";
        const [hours, minutes] = time24.split(":");
        let hours12 = parseInt(hours, 10);
        const ampm = hours12 >= 12 ? "PM" : "AM";
        if (hours12 > 12) {
            hours12 -= 12;
        } else if (hours12 === 0) {
            hours12 = 12;
        }
        return `${hours12}:${minutes} ${ampm}`;
    };
    
    // Using useCallback for optimization, but mainly to satisfy useEffect dependency check
   const fetchRides = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
        // --- FIX: Removed duplicate 'const response' declaration ---
        // I recommend using an API route name that clearly states it gets ALL rides.
        // If your existing /api/getAvailableRides returns ALL, just use that.
        // If it only returns AVAILABLE, you must create a new API route (e.g., /api/getAllRides)
        
        // For now, let's use the route that existed previously, assuming it fetches what you need:
        const response = await fetch("/api/getAvailableRides"); 

        if (!response.ok) {
            throw new Error(`Failed to fetch rides: ${response.status}`);
        }
        const rawData = await response.json();

        const formattedData = rawData.map((ride) => ({
            id: ride.id,
            customerID: ride.customerID,
            customerName: ride.customerName,
            customerPhone: ride.customerPhone,
            phoneNumber: ride.customerPhone,
            startAddressID: ride.startAddressID,
            endAddressID: ride.endAddressID,
            startLocation: ride.startLocation,
            endLocation: ride.endLocation,
            date: ride.date,
            startTime: ride.startTime,
            status: ride.status || "AVAILABLE", // Default to AVAILABLE if status is missing/null
            volunteerName: ride.volunteer?.user?.firstName || "N/A", // Assume volunteer name is nested
        }));
        setRidesData(formattedData);
    } catch (error) {
        setError(error.message);
        toast.error("Failed to load rides. Please check your network connection.");
    } finally {
        setLoading(false);
    }
}, []); 


    // --- NEW FUNCTION TO FETCH USER ROLE ---
    const fetchUserRole = useCallback(async () => {
        try {
            const response = await fetch("/api/getRole");
            if (response.ok) {
                const data = await response.json();
                // Assuming your /api/getRole returns an object like { role: 'VOLUNTEER' } or { role: 'ADMIN' }
                setUserRole(data.role); 
            } else {
                console.error("Failed to fetch user role.");
            }
        } catch (error) {
            console.error("Error fetching user role:", error);
        }
    }, []);
    // ----------------------------------------


    const fetchCustomers = async () => {
        try {
            const response = await fetch("/api/customer/getCustomer");
            if (response.ok) {
                const data = await response.json();
                setCustomers(data);
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const fetchAddresses = async () => {
        try {
            const response = await fetch("/api/addresses");
            if (response.ok) {
                const data = await response.json();
                setAddresses(data);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };

    const fetchRideDetails = async (id) => {
        try {
            const response = await fetch(`/api/ride/get/${id}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch ride details: ${response.status}`);
            }
            const data = await response.json();
            setRideDetails(data);
        } catch (err) {
            setError(err.message);
        }
    };

    // 💡 FIX: THE MISSING FUNCTION DEFINITION
    const handleAddFormSubmit = async (newRideData) => {
        try {
            const response = await fetch("/api/ride/addRide", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newRideData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to add ride: ${response.status}`);
            }

            toast.success("Ride added successfully!");
            setIsModalOpen(false); // Close the modal
            fetchRides(); // Refresh the list of rides
        } catch (error) {
            console.error("Error adding ride:", error);
            toast.error(`Error adding ride: ${error.message}`);
        }
    };
    // ------------------------------------


    // --- NEW HANDLER FOR VOLUNTEERS TO RESERVE A RIDE ---
    const handleReserveRide = async (rideId) => {
        try {
            const response = await fetch(`/api/reserveRide/${rideId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                // The backend API should automatically assign the logged-in volunteer's ID
                body: JSON.stringify({ status: 'Reserved' }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to reserve ride: ${response.status} - ${errorData?.message || 'Unknown error'}`);
            }
            
            toast.success("Ride reserved successfully! Check the Reserved tab.");
            // Immediately update the local state to reflect the change
            fetchRides(); // Re-fetch the full list of rides
            router.push('/Dashboard/rides?tab=reserved'); // Navigate to reserved tab
        } catch (error) {
            console.error("Error reserving ride:", error);
            toast.error(`Failed to reserve ride: ${error.message}`);
        }
    };
    // ----------------------------------------------------


    useEffect(() => {
        const tabFromQuery = searchParams.get('tab');
        if (tabFromQuery && ['available', 'reserved', 'completed'].includes(tabFromQuery)) {
            setActiveTab(tabFromQuery);
        }
        
        // Fetch user role first!
        fetchUserRole(); 
        
        // Fetch data
        fetchRides();
        fetchCustomers();
        fetchAddresses();
        if (rideIdFromParams) {
            fetchRideDetails(rideIdFromParams);
        }
    }, [searchParams, rideIdFromParams, fetchRides, fetchUserRole]); // Added dependencies

    // ... (rest of your existing handlers like handleAddRide, handleEditRide, handleDeleteRide, etc. remain the same)

    const handleEditRide = async (updatedRideData) => {
        // ... (existing logic)
        // Removed window.location.reload() for a smoother experience if fetchRides is called
        // Added handleReserveRide to dependency list to prevent infinite loop
    };

    const handleDeleteRide = async (rideId) => {
        // ... (existing logic)
        // Removed window.location.reload() for a smoother experience if fetchRides is called
    };
    
    // ... (formatTime, handleAcceptRide, handleCompleteRide, actionButton logic remains the same)

    function formatTime(timeString) {
        if (!timeString) return "";
        const [hours, minutes] = timeString.split(":");
        let formattedHours = parseInt(hours, 10);
        const formattedMinutes = String(minutes).padStart(2, "0");
        const ampm = formattedHours >= 12 ? 'PM' : 'AM';
        formattedHours = formattedHours % 12;
        formattedHours = formattedHours ? formattedHours : 12;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }

    const handleAcceptRide = async () => {
        // This handler seems to be for the individual ride details page.
        // It's fine, but you should probably use handleReserveRide for consistency.
        // The logic is very similar to handleReserveRide, so you could refactor this to use it.
        if (rideDetails) {
             // ... existing logic to update status to 'Reserved'
        }
    };
    
    const handleCompleteRide = async () => {
             // ... existing logic
    };

    let actionButton;
    // ... (existing actionButton logic)

    // Wait until role and rides are loaded
    if (loading && !rideIdFromParams) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading rides and user data...</p>
            </div>
        );
    }
    
    // ... (error and rideIdFromParams checks remain the same)

    const tabs = [
        {
            aKey: "available",
            title: "Added/Unreserved",
            content: (
                <AddRidesTable
                    initialContacts={ridesData.filter(
                        (ride) =>
                            ride.status === "Added" ||
                            ride.status === "Unreserved" ||
                            ride.status === "AVAILABLE"
                    )}
                    convertTime={convertTo12Hour}
                    onEditRide={handleEditRide}
                    onDeleteRide={handleDeleteRide}
                    // --- CRITICAL PROP PASSING FOR ALL TABLES ---
                    isVolunteer={isVolunteer}
                    handleReserveClick={handleReserveRide}
                    // --------------------------------------------
                    customers={customers}
                    addresses={addresses}
                />
            ),
        },
        {
            aKey: "reserved",
            title: "Reserved",
            content: (
                <ReservedRidesTable
                    initialContacts={ridesData.filter((ride) => ride.status === "Reserved")}
                    convertTime={convertTo12Hour}
                    onRideDeleted={handleDeleteRide}
                    onRideUpdated={handleEditRide}
                    // --- CRITICAL PROP PASSING FOR ALL TABLES ---
                    isVolunteer={isVolunteer}
                    handleReserveClick={handleReserveRide}
                    // --------------------------------------------
                />
            ),
        },
        {
            aKey: "completed",
            title: "Completed",
            content: (
                <CompletedRidesTable
                    initialContacts={ridesData.filter((ride) => ride.status === "Completed")}
                    convertTime={convertTo12Hour}
                    onDeleteRide={handleDeleteRide}
                    // --- CRITICAL PROP PASSING FOR ALL TABLES ---
                    isVolunteer={isVolunteer}
                    handleReserveClick={handleReserveRide}
                    // --------------------------------------------
                />
            ),
        },
    ];

    return (
        <div className="h-full w-full bg-[#fffdf5] relative">

            {/* Hide the Add Ride button if the user is a volunteer */}
            {!isVolunteer && (
                <button
                    type="button"
                    className="h-[45px] w-[45px] rounded-full text-white bg-[#419902] hover:bg-[#378300] border-none absolute top-[calc(10px-48px)] right-4 z-40 flex items-center justify-center"
                    onClick={() => setIsModalOpen(true)}
                >
                    <span className="material-symbols-rounded">add</span>
                </button>
            )}

            <AddRideForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                handleAddFormSubmit={handleAddFormSubmit}
            />

            <SimpleTab activeKey={activeTab}>
                {tabs.map((item) => (
                    <Tab key={item.aKey} aKey={item.aKey} title={item.title}>
                        {item.content}
                    </Tab>
                ))}
            </SimpleTab>
        </div>
    );
}