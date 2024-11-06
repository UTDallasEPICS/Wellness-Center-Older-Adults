"use client";
import React, { useState} from "react";
import data from "/app/mockdata/mock-data.json";
import DisplayReservedRidesTable from "../components/DisplayReservedRidesTable";

export default function Page() {

  const [ridesData, setRidesData] = useState(data);


  return (
    <div className="h-full w-full bg-white">
      <h1 className="text-black text-left font-light text-[40px] ml-[5%]">Your Rides</h1>

      <div className="h-full w-full bg-white">
        <DisplayReservedRidesTable initialContacts={ridesData}/>


      </div>
    </div>

  );
}
