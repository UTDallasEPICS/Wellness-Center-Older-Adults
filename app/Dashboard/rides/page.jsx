"use client";
import React, { useState, useEffect } from "react";
import SimpleTab, { Tab } from "/app/components/SimpleTab.jsx";
import AddRidesTable from "/app/components/AddRidesTable.jsx";
import ReservedRidesTable from "/app/components/ReservedRidesTable.jsx";
import CompletedRidesTable from "/app/components/CompletedRidesTable.jsx";
import AddRideForm from "/app/components/AddRideForm.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const [ridesData, setRidesData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabsData, setTabsData] = useState([
    { aKey: "added", title: "Added/Unreserved", content: null },
    { aKey: "reserved", title: "Reserved", content: null },
    { aKey: "completed", title: "Completed", content: null },
  ]);
  const [newTabIndex, setNewTabIndex] = useState(0);

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

  const fetchRides = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/getAvailableRides");
      if (!response.ok) {
        throw new Error(`Failed to fetch rides: ${response.status}`);
      }
      const data = await response.json();
      setRidesData(data);
    } catch (error) {
      setError(error.message);
      toast.error(
        "Failed to load rides. Please check your network connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  useEffect(() => {
    setTabsData([
      {
        aKey: "added",
        title: "Added/Unreserved",
        content: (
          <AddRidesTable
            initialContacts={ridesData.filter(
              (ride) => ride.status === "Added" || ride.status === "Unreserved"
            )}
            convertTime={convertTo12Hour}
          />
        ),
      },
      {
        aKey: "reserved",
        title: "Reserved",
        content: (
          <ReservedRidesTable
            initialContacts={ridesData.filter(
              (ride) => ride.status === "Reserved"
            )}
            convertTime={convertTo12Hour}
          />
        ),
      },
      {
        aKey: "completed",
        title: "Completed",
        content: (
          <CompletedRidesTable
            initialContacts={ridesData.filter(
              (ride) => ride.status === "Completed"
            )}
            convertTime={convertTo12Hour}
          />
        ),
      },
    ]);
  }, [ridesData, convertTo12Hour]);


  const handleAddFormSubmit = (newRide) => {
    // Optimistically update the UI by adding the new ride to the state
    setRidesData((prevRides) => [
      ...prevRides,
      { ...newRide, status: "Added" },
    ]);
    setIsModalOpen(false);
    toast.success("Ride added successfully!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading rides...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white relative">
      <button
        type="button"
        className="h-[45px] w-[45px] rounded-full text-white bg-black border-none absolute top-[calc(10px-48px)] right-4 z-40 flex items-center justify-center"
        onClick={() => setIsModalOpen(true)}
      >
        <span className="material-symbols-rounded">add</span>
      </button>

      <AddRideForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleAddFormSubmit={handleAddFormSubmit}
      />

      <SimpleTab activeKey="added" onTabAdd={handleAddTab}>
        {tabsData.map((item) => (
          <div key={item.aKey} aKey={item.aKey} title={item.title}>
            {item.content}
          </div>
        ))}
      </SimpleTab>
    </div>
  );
}
