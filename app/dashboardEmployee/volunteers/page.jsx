"use client"; // Add this at the top of the file

import React, { useState } from "react";
import AddVolunteerPositive from "../../components/AddVolunteerPositive.jsx";
import AddVolunteerNeg from "../../components/AddVolunteerNeg.jsx";
import AddVolunteersTable from "../../components/AddVolunteersTable.jsx";
import MyCalendar from "/app/components/calendar.tsx";
import volunteersMockData from "../../mockdata/volunteersMockData.js";
import { nanoid } from "nanoid";
import EditVolunteerModal from "../../components/EditVolunteerModal.jsx";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal.jsx"; // Import the new modal

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
  const [showEditModal, setShowEditModal] = useState(false); // For controlling edit modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false); // For controlling delete modal visibility
  const [volunteerToDelete, setVolunteerToDelete] = useState(null); // Stores the volunteer to delete

  // Calendar Events (unchanged)
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

  // Handle form change for adding a new volunteer
  const handleAddFormChange = (event) => {
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    setAddFormData({ ...addFormData, [fieldName]: fieldValue });
  };

  // Handle form submit for adding a new volunteer
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

    // Reset the form after submission
    setAddFormData({ name: "", phone: "", email: "" });
    setNotification(<AddVolunteerPositive />);
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle the edit click to show modal with prefilled data
  const handleEditClick = (volunteer) => {
    setEditVolunteerId(volunteer.id);
    setEditFormData({
      name: volunteer.name,
      phone: volunteer.phone,
      email: volunteer.email,
    });
    setShowEditModal(true); // Show the modal when editing
  };

  // Handle form change for editing a volunteer
  const handleEditFormChange = (event) => {
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    setEditFormData({ ...editFormData, [fieldName]: fieldValue });
  };

  // Save the changes after editing a volunteer
  const handleSaveClick = (event) => {
    event.preventDefault();
    const updatedVolunteers = volunteersData.map((volunteer) =>
      volunteer.id === editVolunteerId
        ? { ...volunteer, ...editFormData }
        : volunteer
    );
    setVolunteersData(updatedVolunteers);
    setEditVolunteerId(null);
    setShowEditModal(false); // Close the modal after saving
  };

  // Show delete confirmation modal before deleting a volunteer
  const handleDeleteClick = (volunteerId) => {
    const volunteer = volunteersData.find(v => v.id === volunteerId);
    setVolunteerToDelete(volunteer);
    setShowDeleteModal(true); // Show the delete confirmation modal
  };

  // Confirm the deletion of a volunteer
  const handleConfirmDelete = () => {
    setVolunteersData(volunteersData.filter((volunteer) => volunteer.id !== volunteerToDelete.id));
    setShowDeleteModal(false); // Close the modal after deleting
    setVolunteerToDelete(null); // Reset the volunteer to delete
  };

  // Cancel the delete process and close modal
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setVolunteerToDelete(null); // Reset the volunteer to delete
  };

  // Cancel editing and close edit modal
  const handleCancelClick = () => {
    setEditVolunteerId(null);
    setShowEditModal(false); // Close the modal without saving
  };

  return (
    <div className="h-full w-full bg-white px-6">
      {notification && <div className="absolute top-4 right-4">{notification}</div>}

      {/* Add Volunteer Form */}
      <div className="flex justify-center items-center">
        <form className="w-[70%] mt-8 mb-8" onSubmit={handleAddFormSubmit}>
          <h2 className="text-2xl font-semibold text-center mb-6">Add a Volunteer</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                required
                value={addFormData.name}
                onChange={handleAddFormChange}
                placeholder="Name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                required
                value={addFormData.phone}
                onChange={handleAddFormChange}
                placeholder="Phone"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                required
                value={addFormData.email}
                onChange={handleAddFormChange}
                placeholder="Email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add
            </button>
          </div>
        </form>
      </div>

      {/* Volunteers Table */}
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

      {/* Calendar Section */}
      <div className="mt-8 mb-4 px-8">
        <h2 className="text-lg font-semibold text-center">Schedule Availability</h2>
        <MyCalendar events={events} />
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditVolunteerModal
          editFormData={editFormData}
          handleEditFormChange={handleEditFormChange}
          handleSaveClick={handleSaveClick}
          handleCancelClick={handleCancelClick}
        />
      )}

      {/* Delete Confirmation Modal */}
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


/*
"use client"; // Add this at the top of the file

import React, { useState } from "react";
import AddVolunteerPositive from "../../components/AddVolunteerPositive.jsx";
import AddVolunteerNeg from "../../components/AddVolunteerNeg.jsx";
import AddVolunteersTable from "../../components/AddVolunteersTable.jsx";
import MyCalendar from "/app/components/calendar.tsx";
import volunteersMockData from "../../mockdata/volunteersMockData.js";
import { nanoid } from "nanoid";
import EditVolunteerModal from "../../components/EditVolunteerModal.jsx"; // New import

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
  const [showEditModal, setShowEditModal] = useState(false); // For controlling modal visibility

  // Calendar Events (unchanged)
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

  // Handle form change for adding a new volunteer
  const handleAddFormChange = (event) => {
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    setAddFormData({ ...addFormData, [fieldName]: fieldValue });
  };

  // Handle form submit for adding a new volunteer
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

    // Reset the form after submission
    setAddFormData({ name: "", phone: "", email: "" });
    setNotification(<AddVolunteerPositive />);
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle the edit click to show modal with prefilled data
  const handleEditClick = (volunteer) => {
    setEditVolunteerId(volunteer.id);
    setEditFormData({
      name: volunteer.name,
      phone: volunteer.phone,
      email: volunteer.email,
    });
    setShowEditModal(true); // Show the modal when editing
  };

  // Handle form change for editing a volunteer
  const handleEditFormChange = (event) => {
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    setEditFormData({ ...editFormData, [fieldName]: fieldValue });
  };

  // Save the changes after editing a volunteer
  const handleSaveClick = (event) => {
    event.preventDefault();
    const updatedVolunteers = volunteersData.map((volunteer) =>
      volunteer.id === editVolunteerId
        ? { ...volunteer, ...editFormData }
        : volunteer
    );
    setVolunteersData(updatedVolunteers);
    setEditVolunteerId(null);
    setShowEditModal(false); // Close the modal after saving
  };

  // Delete a volunteer from the list
  const handleDeleteClick = (volunteerId) => {
    const newVolunteers = volunteersData.filter((volunteer) => volunteer.id !== volunteerId);
    setVolunteersData(newVolunteers);
  };

  // Cancel editing and close modal
  const handleCancelClick = () => {
    setEditVolunteerId(null);
    setShowEditModal(false); // Close the modal without saving
  };

  return (
    <div className="h-full w-full bg-white px-6">
      {notification && <div className="absolute top-4 right-4">{notification}</div>}

      {}
      <div className="flex justify-center items-center">
        <form className="w-[70%] mt-8 mb-8" onSubmit={handleAddFormSubmit}>
          <h2 className="text-2xl font-semibold text-center mb-6">Add a Volunteer</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                required
                value={addFormData.name}
                onChange={handleAddFormChange}
                placeholder="Name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                required
                value={addFormData.phone}
                onChange={handleAddFormChange}
                placeholder="Phone"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                required
                value={addFormData.email}
                onChange={handleAddFormChange}
                placeholder="Email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add
            </button>
          </div>
        </form>
      </div>

      {}
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
    </div>
  );
}
*/