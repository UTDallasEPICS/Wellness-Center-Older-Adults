// Updated ReservedRidesTable.jsx - View only, no editing
import { useState, useEffect } from "react";
import ReadOnlyRow from "./ReadOnlyRow";

const ReservedRidesTable = ({ initialContacts, convertTime, isVolunteer }) => {
  const [contacts, setContacts] = useState(initialContacts);

  useEffect(() => {
    setContacts(initialContacts);
  }, [initialContacts]);

  return (
    <div className="flex flex-col gap-2.5 p-4 font-sans overflow-x-auto max-h-[400px] overflow-y-auto">
      <table className="border-collapse ml-[0.5%] w-[99%]">
        <thead>
          <tr>
            <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Client Name</th>
            <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Contact Number</th>
            <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Address</th>
            <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Pick-up Time</th>
            {!isVolunteer && (
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Volunteer Name</th>
            )}
          </tr>
        </thead>
        <tbody>
          {contacts
            .filter((contact) => contact.status === "Reserved")
            .map((contact) => (
              <ReadOnlyRow
                key={contact.id}
                contact={contact}
                status={contact.status}
                convertTime={convertTime}
                startAddress={contact.startAddress}
                isVolunteer={isVolunteer}
                hideActions={true}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservedRidesTable;