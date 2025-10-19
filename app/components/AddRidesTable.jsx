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
    startAddress: "", 
    pickupTime: "",
    volunteerName: "",
  });

  useEffect(() => {
    setContacts(initialContacts);
  }, [initialContacts]);

  // Helper functions (kept as is for functionality)
  const getCustomerNameById = (customerID) => {
    const customer = customers?.find(c => c.id === customerID);
    return customer ? `${customer.firstName} ${customer.lastName}` : '';
  };

  const getCustomerPhoneById = (customerID) => {
    const customer = customers?.find(c => c.id === customerID);
    return customer?.customerPhone || '';
  };

  const getAddressById = (addressID) => {
    const address = addresses?.find(a => a.id === addressID);
    return address ? `${address.street}, ${address.city}, ${address.state} ${address.postalCode}` : '';
  };

  const getVolunteerNameById = (volunteerID) => {
    const volunteer = volunteers?.find(v => v.id === volunteerID);
    if (volunteer && volunteer.user) {
      return `${volunteer.user.firstName} ${volunteer.user.lastName}`;
    }
    return '';
  };

  const getCustomerIdByName = (customerName) => {
    const customer = customers?.find(c => 
      `${c.firstName} ${c.lastName}`.toLowerCase() === customerName.toLowerCase()
    );
    return customer?.id || null;
  };

  const getAddressIdByString = (addressString) => {
    const address = addresses?.find(a => {
      const fullAddress = `${a.street}, ${a.city}, ${a.state} ${a.postalCode}`;
      return fullAddress.toLowerCase() === addressString.toLowerCase();
    });
    return address?.id || null;
  };

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
      customerName: contact.customerName || '',
      phoneNumber: contact.customerPhone || '',
      date: contact.date ? contact.date.split('T')[0] : '', 
      startAddress: contact.startLocation || '',
      pickupTime: contact.startTime ? contact.startTime.slice(0, 5) : '', 
      volunteerName: getVolunteerNameById(contact.volunteerID),
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

    const originalContact = contacts.find((contact) => contact.id === editContactId);

    let customerUpdates = null;
    const currentCustomerName = originalContact.customerName;
    const currentCustomerPhone = originalContact.customerPhone;
    
    if (editFormData.customerName !== currentCustomerName || editFormData.phoneNumber !== currentCustomerPhone) {
      const [firstName, ...lastNameParts] = editFormData.customerName.split(' ');
      customerUpdates = {
        id: originalContact.customerID,
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || '',
        customerPhone: editFormData.phoneNumber || currentCustomerPhone
      };
    }

    let addressUpdates = null;
    if (editFormData.startAddress && editFormData.startAddress !== originalContact.startLocation) {
      const addressParts = editFormData.startAddress.split(',').map(part => part.trim());
      if (addressParts.length >= 3) {
        const street = addressParts[0];
        const city = addressParts[1];
        const stateAndZip = addressParts[2].split(' ');
        const state = stateAndZip[0];
        const postalCode = stateAndZip.slice(1).join(' ');
        
        addressUpdates = {
          id: originalContact.startAddressID,
          street: street,
          city: city,
          state: state,
          postalCode: postalCode
        };
      }
    }

    let volunteerUpdates = null;
    const currentVolunteerName = getVolunteerNameById(originalContact.volunteerID);
    if (editFormData.volunteerName && editFormData.volunteerName !== currentVolunteerName) {
      const volunteerID = getVolunteerIdByName(editFormData.volunteerName);
      volunteerUpdates = {
        volunteerID: volunteerID
      };
    }

    const editedContact = {
      id: editContactId,
      customerID: originalContact.customerID, 
      date: editFormData.date ? new Date(editFormData.date).toISOString() : null,
      startAddressID: originalContact.startAddressID, 
      endAddressID: originalContact.endAddressID,
      pickupTime: pickupDateTimeISO,
      volunteerID: volunteerUpdates?.volunteerID || originalContact.volunteerID,
      status: originalContact.status || 'Unreserved',
      customerUpdates: customerUpdates,
      addressUpdates: addressUpdates,
      volunteerUpdates: volunteerUpdates
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
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Date</th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Time</th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Contact Number</th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Address</th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Status</th>
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
                    startAddress={contact.startLocation}
                    userRole="ADMIN" // Assuming Admin view for Unreserved table actions
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