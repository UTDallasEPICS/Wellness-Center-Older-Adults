"use client";
import React, { useEffect, useState } from "react";

import DisplayRidesTable from "../../components/DisplayRidesTable";
import AddTimeModal from "../../components/AddTimeModal"; 

export default function Page() {
  const [ridesData, setRidesData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    async function fetchRides() {
      try {
        const response = await fetch('/api/getAvailableRides');
        const data = await response.json();
        if (response.ok) {
          setRidesData(data);
        }
        else{
          throw new Error(data.message || 'Failed to fetch rides');
        }
      } catch (error) {
        console.error('Error fetching rides:', error);
      }
    }

    fetchRides();

  }, []);

  // Handler for saving data from the modal
  const handleSaveRide = (duration) => {
    // In a real app, you would send this data to your backend API here
    console.log(`Drive duration recorded: ${duration} hours`);
    // Example of re-fetching or updating state after a successful save
    // setRidesData(prevData => [...prevData, { duration: duration, /* other ride data */ }]);
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="h-full w-full bg-white p-4">
      
      {/* Button Wrapper with Flexbox to push the button right */}
      <div className="flex w-full mb-6">
        
        {/* Add Modal Button - The ml-auto class pushes it to the right */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="ml-auto px-4 py-2 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-150"
        >
          ➕ Add Total Time
        </button>
      </div>
      
      {/* --- Rest of the Content --- */}
      
      <DisplayRidesTable
        ridesData={ridesData}
      />

      {/* The Modal Component */}
      <AddTimeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRide}
      />
    </div>
  );
}