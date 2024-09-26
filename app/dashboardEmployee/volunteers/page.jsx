"use client";
import MyCalendar from "/app/components/calendar.tsx";
import ListItemContainer from "/app/components/ListItemContainer.jsx";
import React, { useState } from "react";

export default function Page() {
  const [events, setEvents] = useState([
    {
      title: 'Meeting with Jane',
      start: new Date(2024, 6, 22, 10, 0),
      end: new Date(2024, 6, 22, 11, 0),
      allDay: false,
    },
    {
      title: 'Lunch with John',
      start: new Date(2024, 6, 23, 12, 0),
      end: new Date(2024, 6, 23, 13, 0),
      allDay: false,
    },
  ]);

  return (
    <div className="w-full h-[95%] bg-white flex flex-col">
      <div className="w-full h-full bg-white flex flex-row">
        <div className="text-black pl-[100px] pt-[50px] text-left font-light text-[30px]">
          <h1>Volunteer Page</h1>
        </div>

        <div className="ml-auto pr-[10px] pt-[5%] bg-white">
          <button type="button" className="h-[45px] w-[45px] rounded-full text-white bg-black border-none">
            <span className="material-symbols-rounded">add</span>
          </button>
        </div>
        <div className="pt-[5%] pr-[10%] bg-white">
          <button type="button" className="h-[45px] w-[45px] rounded-full text-white bg-black border-none">
            <span className="material-symbols-rounded">edit</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-5 text-black px-[25px] py-[17px] font-light text-[15px] bg-white border-b border-gray-300 w-full">
        <p>Name</p>
        <p>Address</p>
        <p>Email</p>
        <p>Phone</p>
        <p>Birthdate</p>
      </div>

      <div className="w-[75%] h-[70%] min-h-[700px] ml-[7%] mt-0 flex flex-col text-black bg-white border-t border-b border-gray-300">
        <ListItemContainer
          clientName="Jane Doe"
          clientAddress="123 Address"
          clientEmail="abc@gmail.com"
          clientPhone="123-456-789"
          clientBirthdate="Jan 15, 1980"
        />
        <ListItemContainer
          clientName="John Smith"
          clientAddress="456 Address"
          clientEmail="def@gmail.com"
          clientPhone="523-456-789"
          clientBirthdate="Dec 15, 1980"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Schedule Availability</h2>
        <MyCalendar events={events} />
      </div>
    </div>
  );
}
