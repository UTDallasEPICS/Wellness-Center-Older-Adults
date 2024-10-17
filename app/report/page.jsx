"use client";
import ReportHoursForm from "/app/components/ReportHoursForm.jsx";
import React, { useState } from "react";


export default function Page() {
  const [ReportFormDisplay, setReportFormDisplay] = useState(false);

  const handleReportButtonPress = (event) => {
    event.preventDefault();
    setReportFormDisplay((prev) => !prev);

  };

  const handleReportHoursSubmit = (hours) => {
    console.log(`Hours Submitted: ${hours}`); //Replace this later with logic of adding this to a database / updating the volunteer's accumulation of total volunteered hours
    setReportFormDisplay(false);
  }

  const handleReportHoursCancel = () => {
    setReportFormDisplay(false);
  }

  return (
    <div className="container mx-auto p-8">
      <button 
      onClick = {handleReportButtonPress}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        {ReportFormDisplay ? "Hide Form" : "Report Hours"}

      </button>

      {ReportFormDisplay && 
      <ReportHoursForm 
        handleReportHoursSubmit = {handleReportHoursSubmit}
        handleReportHoursCancel = {handleReportHoursCancel}
      />}
      
      
    </div>
  );
}
