"use client";
import { useEffect, useState } from "react";
import "/app/styles/dashboardPage.css";
import TextContainer from "/app/components/TextContainer.jsx";
import RecentActivity from "/app/components/RecentActivity"; 


export default function Page() {
  const [userName, setUserName] = useState('');
  useEffect(() => {
    async function fetchUserName() {
      try {
        const response = await fetch('/api/getFirstName');
        const data = await response.json();
        if (response.ok) {
          setUserName(data.firstName);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  
    fetchUserName();
  }, []);
  
  console.log(userName);

  return (
    <div className="h-[90%] w-full">
      <h1 className="text-black text-left font-light text-[40px] ml-[5%]">Welcome, {userName}!</h1>
      <div className="flex flex-col gap-5 md:flex-row">
        <TextContainer text="Recently Completed Rides" number="3" />
        <TextContainer text="This Week's Volunteer Hours" number="5" />
        <TextContainer text="Total Rides for the Week" number="17" />
      </div>
      <RecentActivity />
    </div>
  );
}


    /* 
    <main className="main-content">
      <div className="card-header">
        <div className="title-bar">
          <div className="title">Dashboard</div>
        </div>
      </div>

      <div className="card small"></div>
      <div className="card medium"></div>
      <div className="card medium"></div>
    </main>
    */