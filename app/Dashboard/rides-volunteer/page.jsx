"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify"; 
import DisplayRidesTable from "../../components/DisplayRidesTable"; 
import ReservedRidesTable from "../../components/ReservedRidesTable";

const STORAGE_KEY = 'cachedUser';

// Helper function to safely load user from storage
const getInitialUser = () => {
    if (typeof window !== 'undefined') {
        const cached = sessionStorage.getItem(STORAGE_KEY);
        if (cached) {
            try {
                // Return cached object or false if null
                return JSON.parse(cached);
            } catch (e) {
                return null;
            }
        }
    }
    // Default initial state: null (Loading)
    return null; 
};

export default function Page() {
    // FIX 1: User State from storage
    const [user, setUser] = useState(getInitialUser()); 
    const [isMounted, setIsMounted] = useState(false);
    
    // 🛑 NEW STATE: Track if the network request for user session is pending.
    const [isLoadingSession, setIsLoadingSession] = useState(true);
    
    const [ridesData, setRidesData] = useState([]);
    const [activeTab, setActiveTab] = useState("available");
 
    // 🔑 CORE LOGIC: Safe access to role
    const isVolunteer = user?.role === "VOLUNTEER";
 
    // Utility function
    const convertTime = (time) => 
        new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // FIX 2: Function to fetch the full user session data
    // 🛑 CRITICAL FIX: Empty dependency array to enforce stability and prevent recursive fetching
    const fetchUser = useCallback(async () => {
        // Only run fetch if we are not already processing a successful session.
        if (typeof user === 'object' && user !== null) {
            setIsLoadingSession(false);
            return;
        }

        setIsLoadingSession(true); // Start loading animation
        try {
            const response = await fetch("/api/auth/session");
            const data = await response.json();
            
            if (data.isAuthenticated && data.user && data.user.id) {
                // Success: Update state and cache
                setUser(data.user);
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
                }
            } else {
                // Failure/Logged Out: Clear cache and set user to false
                setUser(false);
                if (typeof window !== 'undefined') {
                    sessionStorage.removeItem(STORAGE_KEY);
                }
            }
        } catch (error) {
            console.error("Error fetching user session:", error);
            // On hard error, fall back to logged-out state
            setUser(false); 
        } finally {
            setIsLoadingSession(false); // Stop loading animation
        }
    }, []); // Empty dependency array forces this function to be stable across renders

    // Define refreshRides
    const refreshRides = useCallback(async () => {
        try {
            const response = await fetch("/api/rides"); 
            const data = await response.json();
            if (response.ok) {
                setRidesData(data);
            } else {
                throw new Error(data.message || "Failed to fetch rides");
            }
        } catch (error) {
            console.error("Error fetching rides:", error);
            toast.error("Failed to load rides."); 
        }
    }, []);

    // FIX 3: Set mounted flag and start initial data fetch
    useEffect(() => {
        setIsMounted(true);
        // Start the API check to get the latest status
        fetchUser(); 
    }, [fetchUser]);

    useEffect(() => {
        // Only run if user is successfully loaded AND we are mounted
        if (user?.id && isMounted) { 
            refreshRides();
        }
    }, [refreshRides, user?.id, isMounted]);

    // ------------------------------------------------------------------
    // Filtering logic
    // ------------------------------------------------------------------
    const availableRides = useMemo(() => {
        return ridesData.filter(
            (ride) => ride.status === "AVAILABLE"
        );
    }, [ridesData]);
    
    const reservedRides = useMemo(() => {
        // Use type check to ensure user is a valid object
        if (typeof user !== 'object' || !user || !user.volunteerID) return []; 
        
        return ridesData.filter(
            (ride) => ride.status === "Reserved" && ride.volunteerID === user.volunteerID
        );
    }, [ridesData, user]);

    // 🚀 RENDER CHECK: The most robust logic:
    // This handles the immediate cache load and the subsequent API check.
    if (!isMounted || (user === null && isLoadingSession)) {
        return <div className="p-8 text-center text-gray-500">Loading rides and session...</div>;
    }
    
    // If user is false (API fetch completed and returned NOT logged in)
    if (user === false) {
           return <div className="p-8 text-center text-red-600">You must be logged in to view rides.</div>;
    }
    
    // If the code reaches here, user is a valid object (from cache or successful API call).

    return (
        <div className="mt-[2%] ml-[calc(5%-20px)] w-[90%]">
            <div className="flex gap-8 mb-2 pl-8 pt-8">
                <button
                    className={`text-2xl font-light pb-2 border-b-4 transition-colors duration-200 ${
                        activeTab === "available"
                          ? "border-gray-700 text-gray-500"
                          : "border-transparent text-gray-400"
                    }`}
                    onClick={() => setActiveTab("available")}
                >
                    Available Rides ({availableRides.length})
                </button>
                <button
                    className={`text-2xl font-light pb-2 border-b-4 transition-colors duration-200 ${
                        activeTab === "reserved"
                          ? "border-gray-700 text-gray-500"
                          : "border-transparent text-gray-400"
                    }`}
                    onClick={() => setActiveTab("reserved")}
                >
                    My Reserved Rides ({reservedRides.length})
                </button>
            </div>
            <div className="rounded-lg border border-gray-300 bg-[#fffdf5] p-6">
                {activeTab === "available" && (
                    <DisplayRidesTable 
                        ridesData={availableRides} 
                        handleReserveClick={handleReserveRide} // Corrected prop name
                        isVolunteer={isVolunteer}             // Passes TRUE/FALSE based on 'role'
                        convertTime={convertTime}             // Passes the utility
                        // NOTE: Ensure startAddress is passed if needed by DisplayRidesTable
                    />
                )}
                {activeTab === "reserved" && (
                    <ReservedRidesTable 
                        initialContacts={reservedRides} 
                        isVolunteer={isVolunteer} 
                        convertTime={convertTime}
                        // Add other necessary handlers (e.g., handleCompleteRide)
                    />
                )}
            </div>
        </div>
    );
}

