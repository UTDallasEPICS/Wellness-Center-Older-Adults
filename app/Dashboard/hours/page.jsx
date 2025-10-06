"use client";

import React, { useState, useEffect } from "react";

export default function Page() {
  const [volunteerHours, setVolunteerHours] = useState([]);
  const [totalHours, setTotalHours] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/volunteer-hours');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setVolunteerHours(data);

        // Calculate total hours from "HH:MM" strings for completed rides
        const totalMinutes = data.reduce((sum, ride) => {
          if (ride.status === 'COMPLETED' && ride.totalTime) {
            const [hours, minutes] = ride.totalTime.split(':').map(Number);
            return sum + (hours * 60) + minutes;
          }
          return sum;
        }, 0);

        const totalHoursVal = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;
        const formattedTotalHours = `${totalHoursVal} hrs, ${remainingMinutes} min`;
        setTotalHours(formattedTotalHours);
      } catch (error) {
        console.error("Could not fetch data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#fffdf5] flex flex-col items-center py-10">
      <h1 className="text-3xl font-light mb-8 ml-4 self-start">Volunteer Hours</h1>
      <div className="mt-[5%] ml-[calc(5%-20px)] w-[90%] text-left rounded-lg border border-gray-300 p-6 bg-[#fffdf5]">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Name</th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Hours</th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Date</th>
            </tr>
          </thead>
          <tbody>
            {volunteerHours && volunteerHours.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-lg font-semibold p-4">
                  No volunteer hours available.
                </td>
              </tr>
            ) : (
              volunteerHours && volunteerHours.map((volunteer, idx) => (
                <tr key={idx}>
                  <td className="text-center bg-[#fffdf5] text-[20px] py-4 px-2 font-light">{volunteer.name}</td>
                  <td className="text-center bg-[#fffdf5] text-[20px] py-4 px-2 font-light">{volunteer.hours}</td>
                  <td className="text-center bg-[#fffdf5] text-[20px] py-4 px-2 font-light">{volunteer.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Display formatted total hours below the table */}
        <div className="mt-8 text-xl text-gray-700 text-center font-semibold">
          Total Volunteer Time: {totalHours}
        </div>
      </div>
    </div>
  );
}