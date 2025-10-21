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
                // Return cached object or null if cache read fails
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
    const [user, setUser] = useState(getInitialUser()); 
    const [isMounted, setIsMounted] = useState(false);
    
    // Track if the network request for user session is pending.
    const [isLoadingSession, setIsLoadingSession] = useState(true);
    
    const [ridesData, setRidesData] = useState([]);
    const [activeTab, setActiveTab] = useState("available");
 
    const isVolunteer = user?.role === "VOLUNTEER";
 
    // Utility function
    const convertTime = (time) => 
        new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

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

    // Define handleReserveRide (Required for DisplayRidesTable)
    const handleReserveRide = useCallback(async (rideID) => {
        if (!user?.id) {
            toast.error("You must be logged in to reserve a ride.");
            return;
        }

        try {
            const response = await fetch(`/api/rides/reserve/${rideID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ volunteerID: user.volunteerID }), 
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Ride reserved successfully! Check 'My Reserved Rides' tab.");
                refreshRides(); 
            } else {
                toast.error(result.message || "Failed to reserve ride.");
            }
        } catch (error) {
            console.error("Error reserving ride:", error);
            toast.error("An unexpected error occurred during reservation.");
        }
    }, [user?.id, user?.volunteerID, refreshRides]);


    // 🚀 FIXED: The problematic early exit conditional has been removed. 
    // The API is now the single source of truth and must always run on mount.
    const fetchUser = useCallback(async () => {
        
        // 🛑 REMOVED THE BLOCK THAT WAS CAUSING THE RACE CONDITION:
        // if (typeof user === 'object' && user !== null) {
        //     setIsLoadingSession(false);
        //     return;
        // }
        
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
    }, []); // Dependency array remains empty for stability

    // --- Effects ---

    // Set mounted flag and start initial data fetch
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

    // --- Filtering logic ---
    const availableRides = useMemo(() => {
        return ridesData.filter(
            (ride) => ride.status === "AVAILABLE"
        );
    }, [ridesData]);
    
    const reservedRides = useMemo(() => {
        if (typeof user !== 'object' || !user || !user.volunteerID) return []; 
        
        return ridesData.filter(
            (ride) => ride.status === "Reserved" && ride.volunteerID === user.volunteerID
        );
    }, [ridesData, user]);

    // --- Render Logic ---

    // Loading/Initial State: Wait for mount and session API check to complete
    if (!isMounted || (user === null && isLoadingSession)) {
        return <div className="p-8 text-center text-gray-500">Loading rides and session...</div>;
    }
   
// Corrected JSX return:
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
                    handleReserveClick={handleReserveRide}
                    isVolunteer={isVolunteer}      
                    convertTime={convertTime}      
                />
            )}
            {activeTab === "reserved" && (
                <ReservedRidesTable 
                    // 🚨 CHANGED PROP NAME for consistency/correctness
                    ridesData={reservedRides} 
                    isVolunteer={isVolunteer} 
                    convertTime={convertTime}
                    // Add other necessary handlers (e.g., handleCompleteRide)
                />
            )}
        </div>
    </div>
);
}