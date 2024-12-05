
import { useState, useEffect } from "react";
import ViewOnlyRow from "./ViewOnlyRow";

const DisplayRidesTable = ({ initialContacts }) => {
  const [contacts, setContacts] = useState(initialContacts);


  useEffect(() => {
    setContacts(initialContacts);
  }, [initialContacts]);


  
 

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
              Pick-up Address
            </th>
            <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
              Drop-off Address
            </th>
            <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
              Pick-up Date
            </th>
            <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
              Pick-up Time
            </th>
            <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
              Drop-off Time
            </th>
            <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {initialContacts.length > 0 ? (
            initialContacts.map((contact) => (
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

