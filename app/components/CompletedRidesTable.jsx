{/*https://www.youtube.com/watch?v=dYjdzpZv5yc */}

import {useState} from "react";

import "app/styles/ridesTable.css";
import data from "app/mock-data.json";



const CompletedRidesTable = ({initialContacts}) => {
    {/* Creates array of data calling from data file*/}
    const [contacts, setContacts] = useState(initialContacts); {/*Change later to pull from data base or replace the data structure from import */}



  return(
    <div className = "tableContainer">
      <table>
        {/* Serves as the header of the table */}
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Contact Number</th>
            <th>Address</th>
            <th>Pick-up Time</th>
            <th>Volunteer Name</th>
          </tr>
        </thead>

        {/* Stores the data */}
        <tbody>
          {/*Pulls element from the data structure to map out information */}
          
          {contacts.filter(contact => contact.status === "Completed").map(contact => (
          <tr>
            <td>{contact.clientName}</td>
            <td>{contact.phoneNumber}</td>
            <td>{contact.address}</td>
            <td>{contact.startTime}</td>
            <td>{contact.volunteerName}</td>
          </tr>
           ))}
        
        </tbody>
      </table>
      {/*Could prob make this a separate component to make it a prompt to add info */}
      

     
        
    </div>
  );
}

export default CompletedRidesTable;