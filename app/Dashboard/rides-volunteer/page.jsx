"use client";
import React, { useEffect, useState } from "react";

import DisplayRidesTable from "../../components/DisplayRidesTable";



export default function Page() {
  const [ridesData, setRidesData] = useState([]);
  
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



  return (
    <div className="h-full w-full bg-white">
     <DisplayRidesTable
     ridesData={ridesData}
     />
    </div>
  );
}