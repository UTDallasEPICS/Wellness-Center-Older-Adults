import { useState, Fragment, useEffect } from "react";
import ReadOnlyRow from "/app/components/ReadOnlyRow.jsx";
import EditableRow from "/app/components/EditableRow.jsx";
import ViewOnlyRow from "./ViewOnlyRow";

const DisplayRidesTable = ({ initialContacts }) => {
  {
    /* Creates array of data calling from data file */
  }
  const [contacts, setContacts] = useState(initialContacts);
  {
    /*Change later to pull from data base or replace the data structure from import */
  }

  const [editContactId, setEditContactId] = useState(null);

  useEffect(() => {
    setContacts(initialContacts);
  }, [initialContacts]);





  return (
    <div className="flex flex-col gap-2.5 p-4 overflow-x-auto max-h-[400px] overflow-y-auto font-sans">
        <table className="border-collapse ml-[0.5%] w-[99%]">
          {/* Serves as the header of the table */}
          <thead>
            <tr>
              <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Client Name</th>
              <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Contact Number</th>
              <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Address</th>
              <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Pick-up Time</th>
              <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Actions</th>
            </tr>
          </thead>

          {/* Stores the data */}
          <tbody>
            {/*Pulls element from the data structure to map out information */}
            {contacts
              .filter((contact) => contact.status === "Added")
              .map((contact) =>
                
                  <ViewOnlyRow
                    key={contact.id}
                    contact={contact}
                  />
                )
              }
          </tbody>
        </table>
        {/* Could prob make this a separate component to make it a prompt to add info */}
    </div>
  );
};

export default DisplayRidesTable;
