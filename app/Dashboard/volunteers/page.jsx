"use client";
import React, { useState, useEffect } from 'react';
import TextContainer from "/app/components/TextContainer.jsx";
import RecentActivity from "/app/components/RecentActivity";
import RecentActivity from "/app/components/RecentActivity";

export default function Page() {
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserName() {
      try {
        const response = await fetch("/api/getFirstName");
        const data = await response.json();
        if (response.ok) {
          setWelcomeMessage(data.message);
          setLoading(false);
        } else {
          console.error(data.error);
          setError('Failed to load user data');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
        setLoading(false);
      }
    }


    fetchUserName();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="h-[90%] w-full">
      <h1 className="text-black text-left font-light text-[40px] ml-[5%]">{welcomeMessage}</h1>
      <div className="flex flex-col gap-5 md:flex-row ml-[5%] mt-6">
        <TextContainer text="Recently Completed Rides" number="3" />
        <TextContainer text="This Week's Volunteer Hours" number="5" />
        <TextContainer text="Total Rides for the Week" number="17" />
      </div>
      <div className="mt-10">
        <RecentActivity />
      </div>
    </div>
  );
}
