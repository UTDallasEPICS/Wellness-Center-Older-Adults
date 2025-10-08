"use client";
import { useState, useEffect } from "react";
import ReadOnlyRow from "/app/components/ReadOnlyRow.jsx";
import EditableRow from "/app/components/EditableRow.jsx";

const AddRidesTable = ({ initialContacts, convertTime, onEditRide, onDeleteRide, customers, addresses, volunteers }) => {
  const [contacts, setContacts] = useState(initialContacts);
  const [editContactId, setEditContactId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    customerName: "",
    phoneNumber: "",
    date: "",
    startAddressID: "",
    endAddressID: "", // Added functionality: field for end address ID
    pickupTime: "",
    volunteerID: "", // Added functionality: field for volunteer ID
  });

  useEffect(() => {
    setContacts(initialContacts);
  }, [initialContacts]);

  // Helper function to get customer name from ID
  const getCustomerNameById = (customerID) => {
    const customer = customers?.find(c => c.id === customerID);
    return customer ? `${customer.firstName} ${customer.lastName}` : '';
  };

  // Helper function to get customer phone from ID
  const getCustomerPhoneById = (customerID) => {
    const customer = customers?.find(c => c.id === customerID);
    return customer?.customerPhone || '';
  };

  // Helper function to get address string from ID
  const getAddressById = (addressID) => {
    const address = addresses?.find(a => a.id === addressID);
    return address ? `${address.street}, ${address.city}, ${address.state} ${address.postalCode}` : '';
  };

  // Helper function to get volunteer name from ID
  const getVolunteerNameById = (volunteerID) => {
    const volunteer = volunteers?.find(v => v.id === volunteerID);
    if (volunteer && volunteer.user) {
      return `${volunteer.user.firstName} ${volunteer.user.lastName}`;
    }
    return '';
  };

  // Helper function to find customer ID by name
  const getCustomerIdByName = (customerName) => {
    const customer = customers?.find(c => 
      `${c.firstName} ${c.lastName}`.toLowerCase() === customerName.toLowerCase()
    );
    return customer?.id || null;
  };

  // Helper function to find address ID by address string
  const getAddressIdByString = (addressString) => {
    const address = addresses?.find(a => {
      const fullAddress = `${a.street}, ${a.city}, ${a.state} ${a.postalCode}`;
      return fullAddress.toLowerCase() === addressString.toLowerCase();
    });
    return address?.id || null;
  };

  // Helper function to find volunteer ID by name
  const getVolunteerIdByName = (volunteerName) => {
    const volunteer = volunteers?.find(v => {
      if (v.user) {
        const fullName = `${v.user.firstName} ${v.user.lastName}`;
        return fullName.toLowerCase() === volunteerName.toLowerCase();
      }
      return false;
    });
    return volunteer?.id || null;
  };

  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.id);
    const formValues = {
      customerID: contact.customerID || "",
      date: contact.date ? contact.date.split('T')[0] : '', // Format date for input
      startAddressID: contact.startAddressID || "",
      endAddressID: contact.endAddressID || "", // Added functionality: populate endAddressID
      pickupTime: contact.startTime ? contact.startTime.slice(0, 5) : '', // Format time for input (HH:MM)
      volunteerID: contact.volunteerID || "", // Added functionality: populate volunteerID
    };
    setEditFormData(formValues);
  };

  const handleEditFormChange = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;
    setEditFormData(newFormData);
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();

    let pickupDateTimeISO = null;
    if (editFormData.date && editFormData.pickupTime) {
      const [hours, minutes] = editFormData.pickupTime.split(':');
      const dateObj = new Date(editFormData.date);
      dateObj.setHours(parseInt(hours, 10));
      dateObj.setMinutes(parseInt(minutes, 10));
      dateObj.setSeconds(0);
      dateObj.setMilliseconds(0);
      pickupDateTimeISO = dateObj.toISOString();
    }

    const editedContact = {
      id: editContactId,
      customerID: editFormData.customerID ? parseInt(editFormData.customerID) : null,
      date: editFormData.date ? new Date(editFormData.date).toISOString() : null,
      startAddressID: contacts.find(contact => contact.id === editContactId)?.startAddressID || null, // Ensure correct address ID
      endAddressID: editFormData.endAddressID ? parseInt(editFormData.endAddressID) : null, // Added functionality: send endAddressID
      pickupTime: pickupDateTimeISO, // Now a full ISO 8601 DateTime
      volunteerID: editFormData.volunteerID ? parseInt(editFormData.volunteerID) : null, // Added functionality: send volunteerID
      status: contacts.find((contact) => contact.id === editContactId)?.status || 'Unreserved',
    };

    onEditRide(editedContact);
    setEditContactId(null);
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleDeleteClick = (contactId) => {
    onDeleteRide(contactId);
  };

  return (
    <div className="flex flex-col gap-2.5 p-4 overflow-x-auto bg-[#fffdf5] max-h-[400px] overflow-y-auto font-sans">
      <form className="flex gap-1.5" onSubmit={handleEditFormSubmit}>
        <table className="bg-[#fffdf5] border-collapse ml-[0.5%] w-[99%]">
          <thead>
            <tr>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Client Name</th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Contact Number</th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Address</th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Pick-up Time</th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts
              .filter((contact) => contact.status === "Unreserved" || contact.status === "AVAILABLE")
              .map((contact) => (
                editContactId === contact.id ? (
                  <EditableRow
                    key={contact.id}
                    editFormData={editFormData}
                    handleEditFormChange={handleEditFormChange}
                    handleCancelClick={handleCancelClick}
                    convertTime={convertTime}
                    customers={customers}
                    addresses={addresses}
                    status={contact.status}
                  />
                ) : (
                  <ReadOnlyRow
                    key={contact.id}
                    contact={contact}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                    convertTime={convertTime}
                    status={contact.status}
                    startAddress={contact.startLocation} // Pass startLocation directly
                  />
                )
              ))}
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default AddRidesTable;
