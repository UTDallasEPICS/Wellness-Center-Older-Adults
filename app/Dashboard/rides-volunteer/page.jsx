"use client";
import React, { useEffect, useState } from "react";
import DisplayRidesTable from "../../components/DisplayRidesTable";
import ReservedRidesTable from "../../components/ReservedRidesTable";
import CompletedRidesTable from "../../components/CompletedRidesTable";

export default function Page() {
  const [ridesData, setRidesData] = useState([]);
  const [activeTab, setActiveTab] = useState("added");

  useEffect(() => {
    async function fetchRides() {
      try {
        const response = await fetch("/api/getAvailableRides");
        const data = await response.json();
        if (response.ok) {
          setRidesData(data);
        } else {
          throw new Error(data.message || "Failed to fetch rides");
        }
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    }

    fetchRides();
  }, []);

  const refreshRides = async () => {
    try {
      const response = await fetch("/api/getAvailableRides");
      const data = await response.json();
      if (response.ok) {
        setRidesData(data);
      } else {
        throw new Error(data.message || "Failed to fetch rides");
      }
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
  };

  const addedRides = ridesData.filter(
    (ride) => ride.status === "AVAILABLE" || ride.status === "Unreserved"
  );
  const reservedRides = ridesData.filter(
    (ride) => ride.status === "Reserved"
  );
  const completedRides = ridesData.filter(
    (ride) => ride.status === "Completed"
  );

  return (
    <div className="mt-[2%] ml-[calc(5%-20px)] w-[90%]">
      <div className="flex gap-8 mb-2 pl-8 pt-8">
        <button
          className={`text-2xl font-light pb-2 border-b-4 transition-colors duration-200 ${
            activeTab === "added"
              ? "border-gray-700 text-gray-500"
              : "border-transparent text-gray-400"
          }`}
          onClick={() => setActiveTab("added")}
        >
          Added/Unreserved
        </button>
        <button
          className={`text-2xl font-light pb-2 border-b-4 transition-colors duration-200 ${
            activeTab === "reserved"
              ? "border-gray-700 text-gray-500"
              : "border-transparent text-gray-400"
          }`}
          onClick={() => setActiveTab("reserved")}
        >
          Reserved
        </button>
        <button
          className={`text-2xl font-light pb-2 border-b-4 transition-colors duration-200 ${
            activeTab === "completed"
              ? "border-gray-700 text-gray-500"
              : "border-transparent text-gray-400"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Completed
        </button>
      </div>
      <div className="rounded-lg border border-gray-300 bg-[#fffdf5] p-6">
        {activeTab === "added" && (
          <DisplayRidesTable ridesData={addedRides} onReserve={refreshRides} />
        )}
        {activeTab === "reserved" && (
          <ReservedRidesTable initialContacts={reservedRides} />
        )}
        {activeTab === "completed" && (
          <CompletedRidesTable initialContacts={completedRides} />
        )}
      </div>
    </div>
  );
}