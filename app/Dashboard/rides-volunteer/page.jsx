"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Added Toastify CSS import
// NOTE: Assuming Next.js navigation hooks are available
import { useSearchParams, useRouter, useParams } from 'next/navigation';

import SimpleTab, { Tab } from "/app/components/SimpleTab.jsx";
import AddRidesTable from "../../components/AddRidesTable"; 
import ReservedRidesTable from "../../components/ReservedRidesTable";
import CompletedRidesTable from "../../components/CompletedRidesTable";
import AddRideForm from "../../components/AddRideForm";
import { Search, Plus } from 'lucide-react'; 

const STORAGE_KEY = 'cachedUser';

// Helper function to safely load user from storage
const getInitialUser = () => {
    if (typeof window !== 'undefined') {
        const cached = sessionStorage.getItem(STORAGE_KEY);
        if (cached) {
            try {
                return JSON.parse(cached);
            } catch (e) {
                return null;
            }
        }
    }
    return null;
};

export default function Page() {
    // Hooks from Next.js Navigation (Required by the example logic)
    const { id: rideIdFromParams } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    // State maintained from your original code (user, mounted, session loading)
    const [user, setUser] = useState(getInitialUser());
    const [isMounted, setIsMounted] = useState(false);
    const [isLoadingSession, setIsLoadingSession] = useState(true);
    
    // Core Data/UI State from the Admin Example
    const [ridesData, setRidesData] = useState([]); // Master ride data (will remain stale)
    const [activeTab, setActiveTab] = useState("unreserved"); 
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true); // Used for initial load screen
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rideDetails, setRideDetails] = useState(null);
    const [selectedRides, setSelectedRides] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [addresses, setAddresses] = useState([]);


    const isVolunteer = user?.role === "VOLUNTEER";

    // Utility function (from your code, standardized to formatTime)
    const formatTime = (time) =>
        new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const convertTime = formatTime; // Alias for use in tables

    // --- Checkbox Handlers (from the example code) ---
    const handleToggleRideSelection = (rideId) => {
        setSelectedRides(prevSelected => {
            if (prevSelected.includes(rideId)) {
                return prevSelected.filter(id => id !== rideId);
            } else {
                return [...prevSelected, rideId];
            }
        });
    };
    const handleToggleAllRides = (currentTableRides, isChecked) => {
        if (isChecked) {
            const allIds = currentTableRides.map(ride => ride.id);
            setSelectedRides(allIds); 
        } else {
            setSelectedRides([]);
        }
    };

    // =========================================================================
    // 🛑 CORE REQUIREMENT: API Recall Without UI Update
    // =========================================================================

    const fetchUser = useCallback(async () => {
        setIsLoadingSession(true); 
        // ... API logic ...
        try {
            const response = await fetch("/api/auth/session");
            const data = await response.json();
            
            if (data.isAuthenticated && data.user && data.user.id) {
                // 🛑 STATE REMOVED
                console.log("User Session API Recalled (Logged In). UI State NOT updated.", data.user);
            } else {
                // 🛑 STATE REMOVED
                console.log("User Session API Recalled (Logged Out). UI State NOT updated.");
            }
        } catch (error) {
            console.error("Error fetching user session:", error);
        } finally {
            setIsLoadingSession(false); 
        }
    }, []); 

    const refreshRides = useCallback(async () => {
        // Only set loading true for the initial fetch if the data is empty
        if (ridesData.length === 0) setLoading(true); 
        setError(null);
        try {
            const response = await fetch("/api/getAvailableRides"); 
            if (!response.ok) {
                throw new Error(`Failed to fetch rides: ${response.status}`);
            }
            const rawData = await response.json();
            
            // 🛑 CRITICAL CHANGE: setRidesData is commented out to prevent UI update
            // setRidesData(formattedData); 
            console.log("Rides API Recalled. UI State (ridesData) NOT UPDATED.");
            
        } catch (error) {
            console.error("Error fetching rides (No UI update applied):", error);
            setError("Error fetching rides in background."); 
        } finally {
            setLoading(false);
        }
    }, []);

    // --- Additional Data Fetchers (Updates REMOVED) ---
    const fetchCustomers = async () => {
        // ... API call to /api/customer/getCustomer ...
        // setCustomers(data); // REMOVED
    };
    const fetchAddresses = async () => {
        // ... API call to /api/getAvailableRides ...
        // setAddresses(data); // REMOVED
    };
    const fetchRideDetails = async (id) => {
        // ... API call to /api/ride/get/${id} ...
        // setRideDetails(data); // REMOVED
    };
    
    // --- Action Handlers (Updates REMOVED or replaced by non-updating refreshRides) ---

    const handleReserveRide = useCallback(async (rideID) => {
        // ... (Reservation API logic) ...
        refreshRides(); // Non-updating API recall
    }, [user?.id, user?.volunteerID, refreshRides]);
    
    const handleAddRide = async (newRideData) => {
        try {
            // ... API call to '/api/createRide' ...
            toast.success("Ride added successfully!");
            setIsModalOpen(false);
            refreshRides(); // Non-updating API recall
        } catch (error) {
            // ... error handling ...
        }
    };
    
    const handleEditRide = async (updatedRideData) => {
        try {
            // ... API call to `/api/rides/${updatedRideData.id}` ...
            toast.success("Ride updated successfully!");
            // setRidesData update removed
            await refreshRides(); // Non-updating API recall
        } catch (error) {
            // ... error handling ...
        }
    };

    const handleDeleteRide = async (rideId) => {
        if (window.confirm("Are you sure you want to delete this ride?")) {
            try {
                // ... API call to `/api/deleteRides/${rideId}` ...
                toast.success("Ride deleted successfully!");
                refreshRides(); // Non-updating API recall
                // setRideDetails(null) and window.location.reload() removed/commented out
            } catch (error) {
                // ... error handling ...
            }
        }
    };

    const handleAddFormSubmit = (formData) => {
        setIsModalOpen(false);
        // window.location.reload(); // REMOVED
    };
    
    const handleAcceptRide = async () => { /* Logic disabled/removed as per requirement */ };
    const handleCompleteRide = async () => { /* Logic disabled/removed as per requirement */ };

    // --- Effects (Initial Load) ---
    useEffect(() => {
        setIsMounted(true);
        fetchUser(); 
        
        // Tab persistence and initial data fetches
        const tabFromQuery = searchParams.get('tab');
        if (tabFromQuery && ['available', 'reserved', 'completed'].includes(tabFromQuery)) {
            setActiveTab(tabFromQuery);
        }
        refreshRides(); 
        fetchCustomers(); 
        fetchAddresses(); 
        
        if (rideIdFromParams) {
            fetchRideDetails(rideIdFromParams);
        }
    }, [searchParams, rideIdFromParams, fetchUser, refreshRides]);


    // --- Filtering Logic (From Example) ---
    const filterRides = useCallback((statusFilter) => {
        return ridesData.filter(ride => {
            const statusMatch = Array.isArray(statusFilter) 
                ? statusFilter.includes(ride.status) 
                : ride.status === statusFilter;
            
            if (!statusMatch) return false;
            if (searchTerm.trim() === '') return true;

            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            // Search logic assumes 'customerName', 'startLocation', 'volunteerName' exist on the ride object
            return (
                (ride.customerName && ride.customerName.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (ride.startLocation && ride.startLocation.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (ride.volunteerName && ride.volunteerName.toLowerCase().includes(lowerCaseSearchTerm))
            );
        });
    }, [ridesData, searchTerm]);

    const unreservedRides = filterRides(["Added", "Unreserved", "AVAILABLE"]);
    const reservedRides = filterRides("Reserved");
    const completedRides = filterRides("Completed");

    // --- Render Logic ---
    if (loading || !isMounted || (user === null && isLoadingSession)) {
        return <div className="p-8 text-center text-gray-500">Loading rides...</div>;
    }
    
    if (error) {
        return <div className="flex items-center justify-center h-screen text-red-500"><p>Error: {error}</p></div>;
    }

    // Skipping single ride details view as its logic is non-functional without state updates
    if (rideIdFromParams) {
        return <div className="p-8">Details View (Functionality disabled due to no state updates)</div>;
    }

    // --- Main Rides Page UI ---
    return (
        <div className="h-full w-full p-10 bg-[#f4f4f4] flex justify-center">
            <div className="max-w-6xl w-full">
                
                {/* Header and Add Button */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-light text-gray-800">Rides</h1>
                    <button
                        type="button"
                        className="h-12 w-12 rounded-full text-white bg-[#419902] hover:bg-[#378300] transition-colors flex items-center justify-center shadow-lg"
                        onClick={() => setIsModalOpen(true)}
                    >
                        {/* <Plus size={28} /> */}
                        +
                    </button>
                </div>

                {/* Search Bar */}
                <div className="flex items-center space-x-4 mb-8">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search by Client, Location, or Volunteer..."
                            className="w-full py-3.5 pl-12 pr-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#419902]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {/* <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} /> */}
                    </div>
                    <button
                        type="button"
                        className="py-3 px-8 text-lg font-semibold rounded-lg text-white bg-[#419902] hover:bg-[#378300] transition-colors shadow-md"
                        onClick={() => { /* Filter is live, button is visual */ }}
                    >
                        Search
                    </button>
                </div>

                {/* Tab Buttons: Unreserved, Reserved, Completed */}
                <div className="flex gap-8 mb-4 border-b border-gray-200">
                    {/* Active tab is set to 'available' but labeled 'Unreserved' */}
                    {["unreserved", "reserved", "completed"].map((tab) => {
                        const count = tab === 'unreserved' ? unreservedRides.length :
                            tab === 'reserved' ? reservedRides.length :
                            completedRides.length;

                        return (
                            <button
                                key={tab}
                                className={`text-xl font-medium pb-2 transition-colors duration-200 capitalize 
                                    ${activeTab === tab 
                                        ? "border-b-4 border-green-700 text-green-700" 
                                        : "text-gray-500 hover:text-green-600"
                                    }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="mt-4">
                    <div>
                        {activeTab === "unreserved" && (
                            <div /* Placeholder: AddRidesTable */ >
                                Unreserved Rides Table (Count: {unreservedRides.length})
                            </div>
                        )}
                        {activeTab === "reserved" && (
                            <div /* Placeholder: ReservedRidesTable */ >
                                Reserved Rides Table (Count: {reservedRides.length})
                            </div>
                        )}
                        {activeTab === "completed" && (
                            <div /* Placeholder: CompletedRidesTable */ >
                                Completed Rides Table (Count: {completedRides.length})
                            </div>
                        )}
                    </div>
                </div>
            </div>
           </div>
    );
}