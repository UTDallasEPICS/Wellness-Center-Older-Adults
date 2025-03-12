
import React from "react";
import ViewOnlyRow from "./ViewOnlyRow";

const DisplayRidesTable = ({ ridesData }) => {
  return (

    <div className="mt-[5%] ml-[calc(5%-20px)] w-[90%] text-left rounded-lg border border-gray-300 p-6 bg-white">
      <h2 className="text-center text-[1.2rem] font-light text-gray-500 mt-4 mb-2">
        Available Rides
      </h2>
      <div className="border-b-[3px] border-gray-600 w-[20%] mx-auto mb-2 mt-[-10px]"></div>

      <table className="border-collapse w-full">
        <thead>
          <tr>
          <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Client Name</th>
          <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Contact Number</th>
          <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Pick-up Address</th>
          <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Drop-Off Address</th>
          <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Pick-up Date</th>
          <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Pick-up Time</th>
          <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Drop-off Time</th>
          <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Actions</th>
          </tr>
        </thead>

        <tbody>
          {ridesData.length > 0 ? (
            ridesData.map((contact) => (
              <ViewOnlyRow
                key={contact.id}
                contact={contact}
              />
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center p-4">
                No rides available
              </td>
            </tr>
          )}
        </tbody>
      </table>


    </div>
  );
};

export default DisplayRidesTable;

