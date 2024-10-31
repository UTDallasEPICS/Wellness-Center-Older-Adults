"use client";
import React, { useState, useEffect } from "react";
import SimpleTab, { Tab } from "/app/components/SimpleTab.jsx";
import DisplayVolunteerRidesTable from "../../components/DisplayVolunteerRidesTable";


export default function Page() {
  const [ridesData, setRidesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect (() => {
    const fetchAvailableRides = async () => {
      try {
        const response = await fetch("/api/getAvailableRides");
        if(!response.ok) {
          throw new Error("Failed to fetch available rides data");
        }

        const availableRidesData = await response.json();
        console.log("Fetched rides data:", availableRidesData);
        setRidesData(availableRidesData);
      } catch(error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableRides();
    
  }, []);

  const tabs = [
    {
      aKey: "AVAILABLE",
      title: "Available",
      content: <DisplayVolunteerRidesTable initialContacts={ridesData} />,
    },
  ];

  if (loading) {
    return <div>Loading Available Rides...</div>;
  }

  if (error) {
    return <div> Error: {error} </div>;
  }

  return (
    
    <div className="h-full w-full bg-white">
      <SimpleTab activeKey="AVAILABLE">
        {tabs.map((item) => (
          <Tab key={item.aKey} aKey={item.aKey} title={item.title}>
            {React.cloneElement(item.content, { initialContacts: ridesData })}
          </Tab>
        ))}
      </SimpleTab>
    </div>
  );
}
