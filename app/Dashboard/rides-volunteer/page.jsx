"use client";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify"; 
import DisplayRidesTable from "../../components/DisplayRidesTable"; 
import ReservedRidesTable from "../../components/ReservedRidesTable";


export default function Page() {
  
    const [ridesData, setRidesData] = useState([]);
    const [activeTab, setActiveTab] = useState("available");
  
    // 🔑 CORE LOGIC: Derive isVolunteer from the reliable 'role' string.
    const isVolunteer = user?.role === "VOLUNTEER";
  
    // Utility function needed by ReadOnlyRow/ViewOnlyRow
    const convertTime = (time) => 
      new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Define refreshRides using useCallback for stability and dependencies
    const refreshRides = useCallback(async () => {
      try {
        // NOTE: Update this API call to fetch ALL rides the current user should see
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

    useEffect(() => {
      // Only run if user data is loaded (user?.id ensures we have the user object)
      if (user?.id) { 
          refreshRides();
      }
    }, [refreshRides, user?.id]);

    // ------------------------------------------------------------------
    // 1. Reserve Ride Handler
    // ------------------------------------------------------------------
    const handleReserveRide = async (rideId) => {
      if (!rideId || !user?.volunteerID) {
          toast.error("Cannot reserve ride: Missing user/ride ID.");
          return;
      }

      try {
        // The PUT body now explicitly sends the volunteerID
        const response = await fetch(`/api/reserveRide/${rideId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
              status: 'Reserved', 
              volunteerID: user.volunteerID // Pass the ID from the logged-in user
          }), 
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to reserve ride");
        }

        toast.success("Ride reserved successfully! See the Reserved Rides tab.");
      
        // Refresh and switch tab
        await refreshRides();
        setActiveTab("reserved"); 

      } catch (error) {
        console.error("Error reserving ride:", error);
        toast.error(`Failed to reserve ride: ${error.message}`);
      }
    };

    // ------------------------------------------------------------------
    // 2. Filter Rides
    // ------------------------------------------------------------------
    // The 'Available' tab shows rides that can be taken by any volunteer
    const availableRides = ridesData.filter(
      (ride) => ride.status === "AVAILABLE"
    );
    // The 'Reserved' tab shows rides specifically reserved by the current user
    const reservedRides = ridesData.filter(
      (ride) => ride.status === "Reserved" && ride.volunteerID === user?.volunteerID
    );

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