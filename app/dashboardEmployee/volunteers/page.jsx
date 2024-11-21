"use client";
import React, { useState } from "react";
import AddVolunteerPositive from "/app/components/AddVolunteerPositive.jsx";
import AddVolunteerNeg from "/app/components/AddVolunteerNeg.jsx";
import AddVolunteersTable from "/app/components/AddVolunteersTable.jsx";
import volunteersMockData from "/app/mockdata/volunteersMockData";
import { nanoid } from "nanoid";
import EditVolunteerModal from "/app/components/EditVolunteerModal.jsx";
import DeleteConfirmationModal from "/app/components/DeleteConfirmationModal.jsx";
import AddVolunteerForm from "/app/components/AddVolunteerForm.jsx";
import MyCalendar from "/app/components/calendar.tsx"; 

export default function Page() {
  const [volunteersData, setVolunteersData] = useState(volunteersMockData || []);
  const [addFormData, setAddFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [editVolunteerId, setEditVolunteerId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [notification, setNotification] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [volunteerToDelete, setVolunteerToDelete] = useState(null);

  const [events, setEvents] = useState([
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
  ]);

  const handleAddFormChange = (event) => {
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    setAddFormData({ ...addFormData, [fieldName]: fieldValue });
  };

  const handleAddFormSubmit = (event) => {
    event.preventDefault();

    if (!addFormData.name.trim() || !addFormData.phone.trim() || !addFormData.email.trim()) {
      setNotification(<AddVolunteerNeg />);
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const newVolunteer = {
      id: nanoid(),
      name: addFormData.name,
      phone: addFormData.phone,
      email: addFormData.email,
    };

    setVolunteersData([...volunteersData, newVolunteer]);
    setAddFormData({ name: "", phone: "", email: "" });
    setNotification(<AddVolunteerPositive />);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEditClick = (volunteer) => {
    setEditVolunteerId(volunteer.id);
    setEditFormData({
      name: volunteer.name,
      phone: volunteer.phone,
      email: volunteer.email,
    });
    setShowEditModal(true); 
  };

  const handleEditFormChange = (event) => {
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    setEditFormData({ ...editFormData, [fieldName]: fieldValue });
  };

  const handleSaveClick = (event) => {
    event.preventDefault();
    const updatedVolunteers = volunteersData.map((volunteer) =>
      volunteer.id === editVolunteerId
        ? { ...volunteer, ...editFormData }
        : volunteer
    );
    setVolunteersData(updatedVolunteers);
    setEditVolunteerId(null);
    setShowEditModal(false);
  };

  const handleDeleteClick = (volunteerId) => {
    const volunteer = volunteersData.find((v) => v.id === volunteerId);
    setVolunteerToDelete(volunteer);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setVolunteersData(volunteersData.filter((volunteer) => volunteer.id !== volunteerToDelete.id));
    setShowDeleteModal(false);
    setVolunteerToDelete(null);
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

      {}
      <div className="mt-8 mb-4 px-8">
        <h2 className="text-lg font-semibold text-center">Schedule Availability</h2>
        <MyCalendar events={events} />
      </div>

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
          volunteerName={volunteerToDelete?.name}
          handleConfirmDelete={handleConfirmDelete}
          handleCancelDelete={handleCancelDelete}
        />
      )}
    </div>
  );
}
