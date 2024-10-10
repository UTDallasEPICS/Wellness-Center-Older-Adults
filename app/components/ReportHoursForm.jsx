'use client';
import React, { useState } from "react";


const ReportHoursForm = ({
  handleReportHoursSubmit,
  handleReportHoursCancel
}) => {


  const [hours, setHours] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isNaN(hours) || hours <= 0 || hours.trim() === '') {
      setError('Please enter a valid number');
      return;
    }

    setError('');
    handleReportHoursSubmit(hours);

  }

  return (
    <div className="w-[400px] mx-auto p-8 bg-gray-100 rounded-lg shadow-md">
      <form
        className="flex flex-col space-y-4"
        onSubmit = {handleSubmit}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Insert Hours Volunteered
          </label>

          <input
            className="w-full p-3 text-sm border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:border-blue-500"
            type="text"
            placeholder="Hours Volunteered"
            value = {hours}
            onChange = {(e) => setHours(e.target.value)}
            
           
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <div className="flex justify-between space-x-4">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick = {handleReportHoursCancel}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportHoursForm;