"use client";
import React, { useEffect, useState } from "react";
import AddVolunteerPositive from "/app/components/AddVolunteerPositive.jsx"; //Notification Pos / Neg
import AddVolunteerNeg from "/app/components/AddVolunteerNeg.jsx";
import AddVolunteersTable from "/app/components/AddVolunteersTable.jsx"; // Volunteer Table
import EditVolunteerModal from "/app/components/EditVolunteerModal.jsx"; 
import DeleteConfirmationModal from "/app/components/DeleteConfirmationModal.jsx";
import AddVolunteerForm from "/app/components/AddVolunteerForm.jsx";
//import MyCalendar from "/app/components/calendar.tsx"; 

export default function Page() {
  

  const [volunteersData, setVolunteersData] = useState([]);
  useEffect(() => {
    async function fetchVolunteers() {
      try {
        const response = await fetch('/api/getAllVolunteers');
        const data = await response.json();
        if (response.ok) {
          setVolunteersData(data);
        }
        else{
          throw new Error(data.message || 'Failed to fetch volunteer');
        }
      } catch (error) {
        
        console.error('Error fetching volunteers:', error);
      }
    }

    fetchVolunteers();
  }, []);

  const [addFormData, setAddFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [editVolunteerId, setEditVolunteerId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

  });

  const [notification, setNotification] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [volunteerToDelete, setVolunteerToDelete] = useState(null);

  {/*const [events, setEvents] = useState([
    {
      title: 'Meeting with Jane',
      start: new Date(2024, 6, 22, 10, 0),
      end: new Date(2024, 6, 22, 11, 0),
      allDay: false,
    },
    {
      title: 'Lunch with John',
      start: new Date(2024, 6, 23, 12, 0),
      end: new Date(2024, 6, 23, 13, 0),
      allDay: false,
    },
  ]); */} 

  const handleAddFormChange = (event) => {
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    setAddFormData({ ...addFormData, [fieldName]: fieldValue });
  };

  const handleAddFormSubmit = async (event) => {
    event.preventDefault();

    if (!addFormData.firstName.trim() || 
        !addFormData.lastName.trim() || 
        !addFormData.email.trim() ||
        !addFormData.phone.trim()) {
         
      setNotification(<AddVolunteerNeg errorMessage="Volunteer not added! Empty Field(s)!"/>);
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const newVolunteer = {
      firstName: addFormData.firstName,
      lastName: addFormData.lastName,
      email: addFormData.email,
      phone: addFormData.phone,
    };

    try {
      const response = await fetch('/api/addVolunteer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVolunteer),
      });

      const data = await response.json();

      if (!response.ok || data.status === 400 || data.status === 500) {
        throw new Error(data.message || 'Failed to add volunteer');
      }

      // Only execute if we got a successful response
      if (data.status === 200) {
        setVolunteersData((prevData) => [
          ...prevData,
          {...newVolunteer, status: "AVAILABLE"},
        ]);
        
        setAddFormData({ firstName: "", lastName: "", email: "", phone: "" });
        setNotification(<AddVolunteerPositive />);
        setTimeout(() => setNotification(null), 3000);
      }
      
    } catch (error) {
      console.error('Error adding volunteer:', error);
      setNotification(<AddVolunteerNeg errorMessage = {error.message}/>);
      setTimeout(() => setNotification(null), 3000);
    }
};

  const handleEditClick = (volunteer) => {
    setEditVolunteerId(volunteer.VolunteerID);
    setEditFormData({
      firstName: volunteer.firstName,
      lastName: volunteer.lastName,
      email: volunteer.email,
      phone: volunteer.phone,
    });
    setShowEditModal(true); 
  };

  const handleEditFormChange = (event) => {
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    setEditFormData({ ...editFormData, [fieldName]: fieldValue });
  };

  const handleSaveClick = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch('/api/editVolunteer', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editVolunteerId,
            ...editFormData
          }),
      });

      const result = await response.json();

      if (result.status === 200) {
        const updatedVolunteers = volunteersData.map((volunteer) =>
        volunteer.VolunteerID == editVolunteerId
        ?{...volunteer, ...editFormData}:
        volunteer);

      setVolunteersData(updatedVolunteers);
      setEditVolunteerId(null);
      setShowEditModal(false);

    } else {
      console.error(result.message);
      setNotification(<AddVolunteerNeg errorMessage = {result.message} className = "z-[100]"/>);
      setTimeout(() => setNotification(null), 3000);
   
      
    }
  }catch (error){
    console.error('Error updating volunteer:', error);
  }
  };

  const handleDeleteClick = (VolunteerID) => {
    const volunteer = volunteersData.find((v) => v.VolunteerID === VolunteerID);
    setVolunteerToDelete(volunteer);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch('/api/deleteVolunteer', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: volunteerToDelete.VolunteerID
        }),
      });

      const data = await response.json();

      if(response.ok) {
        setVolunteersData(volunteersData.filter(
          (volunteer) => volunteer.VolunteerID !== volunteerToDelete.VolunteerID
        ));

      
        setShowDeleteModal(false);
        setVolunteerToDelete(null);
      
      } else {
        throw new Error(data.message || 'Failed to delete volunteer');
      }

      }catch (error) {
       console.error('Error deleting volunteer:', error);
      }

    };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setVolunteerToDelete(null);
  };

  const handleCancelClick = () => {
    setEditVolunteerId(null);
    setShowEditModal(false);
  };

  return (
    <div className="h-full w-full bg-white px-6">
      {notification && <div className="absolute top-4 right-4">{notification}</div>}

      {}
      <div className="flex justify-center items-center">
        <AddVolunteerForm
          addFormData={addFormData}
          handleAddFormSubmit={handleAddFormSubmit}
          handleAddFormChange={handleAddFormChange}
        />
      </div>
      
      {}
      <div className="mt-8">
        <AddVolunteersTable
          volunteersData={volunteersData}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          handleEditFormChange={handleEditFormChange}
          handleSaveClick={handleSaveClick}
          handleCancelClick={handleCancelClick}
          editVolunteerId={editVolunteerId}
          editFormData={editFormData}
        />
      </div>
      {/*{}
      
      
      <div className="mt-8 mb-4 px-8">
        <h2 className="text-lg font-semibold text-center">Schedule Availability</h2>
        <MyCalendar events={events} />
      </div>
      */}
      {}
      {showEditModal && (
        <EditVolunteerModal
          editFormData={editFormData}
          handleEditFormChange={handleEditFormChange}
          handleSaveClick={handleSaveClick}
          handleCancelClick={handleCancelClick}
        />
      )}

      {}
      {showDeleteModal && (
        <DeleteConfirmationModal
          volunteerName={`${volunteerToDelete?.firstName} ${volunteerToDelete?.lastName}`}
          handleConfirmDelete={handleConfirmDelete}
          handleCancelDelete={handleCancelDelete}
        />
      )}
    </div>
  );
}
