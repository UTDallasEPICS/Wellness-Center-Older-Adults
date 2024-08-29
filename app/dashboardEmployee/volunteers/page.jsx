"use client"
import MyCalendar from "/app/components/calendar.tsx"
import ListItemContainer from "/app/components/ListItemContainer.jsx";
import "/app/styles/clientPage.css";
import React, { useState } from "react";

export default function Page() {
  const [events, setEvents]= useState([
    {
      title: 'Meeting with Jane',
      start: new Date(2024, 6, 22, 10, 0), // Month is 0-based, so 6 represents July
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
    <div className="clientPageContainer">
      <div className="clientBoxHead">
        <div className="clientTitle">
          <h1>Volunteer Page</h1>
        </div>

        <div className="addClientButtonContainer">
          <button type="button" className="editButton">
            <span className="material-symbols-rounded">add</span>
          </button>
        </div>
        <div className="editButtonContainer">
          <button type="button" className="editButton">
            <span className="material-symbols-rounded">edit</span>
          </button>
        </div>
      </div>
      <div className="clientListLabels">
        <p>Name</p>
        <p>Address</p>
        <p>Email</p>
        <p>Phone</p>
        <p>Birthdate</p>
      </div>
      <div className="clientListContainer">
        <p> </p>
        <ListItemContainer
          clientName="Jane Doe"
          clientAddress="123 Address"
          clientEmail="abc@gmail.com"
          clientPhone="123-456-789"
          clientBirthdate="Jan 15, 1980"
        />
        <p> </p>
        <ListItemContainer
          clientName="John Smith"
          clientAddress="456 Address"
          clientEmail="def@gmail.com"
          clientPhone="523-456-789"
          clientBirthdate="Dec 15, 1980"
        />
      </div>
      <div className="scheduleAvailability">
        <h2>Schedule Availability</h2>
        <MyCalendar events={events} />
      </div>
    </div>
  );
}
