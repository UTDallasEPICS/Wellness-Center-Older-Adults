
import { useState, useEffect } from "react";
import ViewOnlyRow from "./ViewOnlyRow";

const DisplayRidesTable = ({ initialContacts }) => {
  const [contacts, setContacts] = useState(initialContacts);


  useEffect(() => {
    setContacts(initialContacts);
  }, [initialContacts]);

  
  const unreservedContacts = contacts.filter(
    (contact) => contact.status === "Unreserved"
  );

  return (
    <div className="flex flex-col gap-2.5 p-4 overflow-x-auto max-h-[400px] overflow-y-auto font-sans">
      <table className="border-collapse ml-[0.5%] w-[99%]">
        <thead>
          <tr>
            <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
              Client Name
            </th>
            <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
              Contact Number
            </th>
            <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
              Address
            </th>
            <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
              Pick-up Time
            </th>
            <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {unreservedContacts.length > 0 ? (
            unreservedContacts.map((contact) => (
              <ViewOnlyRow
                key={contact.id}
                contact={contact}
                status={contact.status}
              />
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No unreserved rides available
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
};

export default DisplayRidesTable;

