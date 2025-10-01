"use client";
import { useEffect, useState } from "react";
import TextContainer from "/app/components/TextContainer.jsx";
import RecentActivity from "/app/components/RecentActivity"; 


export default function Page() {
  const [welcomeMessage, setWelcomeMessage] = useState('');
  useEffect(() => {
    async function fetchUserName() {
      try {
        const response = await fetch('/api/getFirstName');
        const data = await response.json();
        if (response.ok) {
          setWelcomeMessage(data.message);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  
    fetchUserName();
  }, []);
  
  return (
    <div className="h-[90%] w-full bg-[#f4f1f0]">
      <h1 className="text-[#103713] text-left font-light text-[40px] ml-[5%]">{welcomeMessage}</h1>
      <div className="flex flex-col gap-5 md:flex-row">
        <TextContainer text="Recently Completed Rides" number="3" />
        <TextContainer text="This Week's Volunteer Hours" number="5" />
        <TextContainer text="Total Rides for the Week" number="17" />
      </div>
      <RecentActivity />
    </div>
  );
}