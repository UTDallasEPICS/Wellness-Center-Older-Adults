import { useState, Fragment, useEffect } from "react";

import CancelRidesModel from "/app/components/CancelRidesModel.jsx"
import ReservedRides from "/app/components/ReservedRides.jsx"


const DisplayReservedRidesTable = ({ initialContacts }) => {
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

    const [isCancelModelOpen, setIsCancelModelOpen] = useState(false);





    const handleCancelClick = (contactId) => {
      const newContacts = [...contacts];
      const index = contacts.findIndex((contact) => contact.id === contactId);
      newContacts.splice(index, 1);
      setContacts(newContacts);
    };



    return (

      <div className="p-5 md:p-10 mt-10 mx-auto  w-full max-w-6xl rounded-2xl shadow-md">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full p-2.5">
          {contacts.filter((contact) => contact.status === "Reserved").length > 0 ?
            contacts
              .filter((contact) => contact.status === "Reserved")
              .map((contact) => (
                <ReservedRides
                  contact={contact}
                  handleCancelClick={handleCancelClick}
                />
              )
          ) : (
            <li className="col-span-1 md:col-span-2 text-center">No reserved rides</li>
          )

            
          }


          
        </ul>
      </div>

      

    );

    


  };
  
  export default DisplayReservedRidesTable;