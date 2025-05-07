// AddRidesTable.jsx
import { useState, useEffect } from "react";
import ReadOnlyRow from "/app/components/ReadOnlyRow.jsx";
import EditableRow from "/app/components/EditableRow.jsx";

const AddRidesTable = ({ initialContacts, convertTime, onAddRide, onEditRide, onDeleteRide }) => {
  const [contacts, setContacts] = useState(initialContacts);
  const [editContactId, setEditContactId] = useState(null);
  const [addFormData, setAddFormData] = useState({
    // Adjust these based on your actual ride creation form fields
    customerID: "",
    date: "",
    startAddressID: "", // You might need to rethink how you handle address IDs for new rides
    pickupTime: "",
  });
  const [editFormData, setEditFormData] = useState({
    customerID: "",
    date: "",
    startAddressID: "",
    pickupTime: "",
  });

  useEffect(() => {
    setContacts(initialContacts);
  }, [initialContacts]);

  const handleAddFormChange = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;
    setAddFormData(newFormData);
  };

  const handleAddFormSubmit = (event) => {
    event.preventDefault();
    if (onAddRide) {
      onAddRide(addFormData); // Send the new ride data to the parent
      setAddFormData({ customerID: "", date: "", startAddressID: "", pickupTime: "" }); // Clear form
    }
  };

  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.id);
    setEditFormData({
      customerID: contact.customerID,
      date: contact.date,
      startAddressID: contact.startAddressID,
      pickupTime: contact.pickupTime,
    });
  };

  const handleEditFormChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setEditFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();
    if (onEditRide && editContactId) {
      const updatedRide = { id: editContactId, ...editFormData };
      onEditRide(updatedRide); // Send updated ride data to the parent
      setEditContactId(null);
    }
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleDeleteClick = (contactId) => {
    if (onDeleteRide) {
      onDeleteRide(contactId); // Send the ID of the ride to delete to the parent
    }
  };

  return (
    <div className="flex flex-col gap-2.5 p-4 overflow-x-auto max-h-[400px] overflow-y-auto font-sans">
      {/* Add Ride Form (if you want it directly in this table view) */}
      {/* <form className="flex gap-1.5 mb-4" onSubmit={handleAddFormSubmit}>
        <input type="text" name="customerID" placeholder="Client ID" className="border p-2" onChange={handleAddFormChange} value={addFormData.customerID} />
        <input type="date" name="date" className="border p-2" onChange={handleAddFormChange} value={addFormData.date} />
        <input type="text" name="startAddressID" placeholder="Address ID" className="border p-2" onChange={handleAddFormChange} value={addFormData.startAddressID} />
        <input type="time" name="pickupTime" className="border p-2" onChange={handleAddFormChange} value={addFormData.pickupTime} />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Add Ride</button>
      </form> */}

      <form className="flex gap-1.5" onSubmit={handleEditFormSubmit}>
        <table className="border-collapse ml-[0.5%] w-[99%]">
          <thead>
            <tr>
              <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Client Name</th>
              <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Contact Number</th>
              <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Address</th>
              <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Pick-up Time</th>
              <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts
              .filter((contact) => contact.status === "Unreserved" || contact.status === "Added") // Adjust filter to include newly added
              .map((contact) =>
                editContactId === contact.id ? (
                  <EditableRow
                    key={contact.id}
                    editFormData={editFormData}
                    handleEditFormChange={handleEditFormChange}
                    handleCancelClick={handleCancelClick}
                    convertTime={convertTime}
                  />
                ) : (
                  <ReadOnlyRow
                    key={contact.id}
                    contact={contact}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                    convertTime={convertTime}
                  />
                )
              )}
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default AddRidesTable;