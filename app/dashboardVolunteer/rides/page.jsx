"use client";
import React, { useState } from "react";
import SimpleTab, { Tab } from "/app/components/SimpleTab.jsx";
import DisplayRidesTable from "../../components/DisplayRidesTable";
import ViewOnlyRow from "../../components/ViewOnlyRow";
import data from "/app/mockdata/mock-data-new.js";

export default function Page() {
  const [ridesData, setRidesData] = useState(data);

  const tabs = [
    {
      aKey: "added",
      title: "Added",
      content: <DisplayRidesTable initialContacts={ridesData} />,
    },
  ];

  return (
    <div className="h-full w-full bg-white">
      <SimpleTab activeKey="added">
        {tabs.map((item) => (
          <Tab key={item.aKey} aKey={item.aKey} title={item.title}>
            {React.cloneElement(item.content, { initialContacts: ridesData })}
          </Tab>
        ))}
      </SimpleTab>
    </div>
  );
}
