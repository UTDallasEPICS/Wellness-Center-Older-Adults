// app\Dashboard\volunteers\page.jsx
"use client";
import React, { useEffect, useState } from "react";
import AddVolunteersTable from "/app/components/AddVolunteersTable.jsx";
import EditVolunteerModal from "/app/components/EditVolunteerModal.jsx";
import DeleteConfirmationModal from "/app/components/DeleteConfirmationModal.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 50,
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  maxWidth: '90%',
  maxHeight: '90%',
  overflowY: 'auto',
  position: 'relative',
};

const modalCloseButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'none',
  border: 'none',
  fontSize: '1.5em',
  cursor: 'pointer',
  color: 'gray',
};

export default function Page() {
  const [volunteersData, setVolunteersData] = useState([]);
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [volunteerToDelete, setVolunteerToDelete] = useState(null); // Changed to store only ID
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchVolunteers = async () => {
    try {
      const response = await fetch('/api/getAllVolunteers');
      const data = await response.json();
      if (response.ok) {
        setVolunteersData(data);
      } else {
        throw new Error(data.message || 'Failed to fetch volunteers');
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      toast.error('Error fetching volunteers.');
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleAddFormChange = (event) => {
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    setAddFormData({ ...addFormData, [fieldName]: fieldValue });
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setAddFormData({ firstName: "", lastName: "", email: "", phone: "" });
  };

  const handleAddFormSubmit = async (event) => {
    event.preventDefault();

    if (!addFormData.firstName.trim() ||
      !addFormData.lastName.trim() ||
      !addFormData.email.trim() ||
      !addFormData.phone.trim()) {
      toast.error("Volunteer not added! Empty Field(s)!");
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

      if (data.status === 200) {
        setVolunteersData((prevData) => [
          ...prevData,
          { ...data.volunteer, status: "AVAILABLE" },
        ]);
        handleCloseAddModal();
        toast.success("Volunteer added successfully!");
      }
    } catch (error) {
      console.error('Error adding volunteer:', error);
      toast.error(error.message || "Failed to add volunteer.");
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
    event.preventDefault();
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
          volunteer.VolunteerID === editVolunteerId
            ? { ...volunteer, ...editFormData }
            : volunteer
        );

        setVolunteersData(updatedVolunteers);
        setEditVolunteerId(null);
        setShowEditModal(false);
        toast.success("Volunteer updated successfully!");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error updating volunteer:', error);
      toast.error(error.message || "Failed to update volunteer.");
    }
  };

  const handleDeleteClick = (VolunteerID) => {
    console.log("Delete button clicked for VolunteerID:", VolunteerID);
    setVolunteerToDelete(VolunteerID); // Store only the ID
    console.log("volunteerToDelete state:", VolunteerID);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    console.log("handleConfirmDelete called. volunteerToDelete:", volunteerToDelete);
    const volunteerIdToDelete = volunteerToDelete; // Directly use the ID
    console.log("volunteerIdToDelete:", volunteerIdToDelete);
    const previousVolunteersData = [...volunteersData];

    // Optimistically update the UI
    setVolunteersData(volunteersData.filter(
      (volunteer) => volunteer.VolunteerID !== volunteerIdToDelete
    ));
    setShowDeleteModal(false);
    setVolunteerToDelete(null);

    try {
      const response = await fetch(`/api/deleteVolunteer/${volunteerIdToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // Revert the optimistic update on error
        setVolunteersData(previousVolunteersData);
        const errorData = await response.json();
        throw new Error(errorData?.message || 'Failed to delete volunteer');
      }

      toast.success("Volunteer deleted successfully!");
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      toast.error(error.message || "Failed to delete volunteer.");
      // Optionally, re-fetch data to ensure consistency if optimistic update fails consistently
      // fetchVolunteers();
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
      <div className="flex justify-end items-center mb-4">
        <button
          type="button"
          className="h-[45px] w-[45px] rounded-full text-white bg-black border-none flex items-center justify-center"
          onClick={handleOpenAddModal}
        >
          <span className="material-symbols-rounded">add</span>
        </button>
      </div>
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

      {isAddModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <button style={modalCloseButtonStyle} onClick={handleCloseAddModal}>&times;</button>
            <h2 className="text-left font-light text-2xl mb-5">Add a Volunteer</h2>
            <form
              className="flex flex-col space-y-4"
              onSubmit={handleAddFormSubmit}
            >
              <div className="w-full">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={addFormData.firstName}
                  onChange={handleAddFormChange}
                />
              </div>

              <div className="w-full">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={addFormData.lastName}
                  onChange={handleAddFormChange}
                />
              </div>

              <div className="w-full">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={addFormData.email}
                  onChange={handleAddFormChange}
                />
              </div>

              <div className="w-full">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={addFormData.phone}
                  onChange={handleAddFormChange}
                />
              </div>

              <div className="w-full flex justify-end mt-4">
                <button
                  className="bg-green-600 text-white px-6 py-2.5 text-base rounded-lg cursor-pointer hover:bg-green-700"
                  type="submit"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <EditVolunteerModal
          editFormData={editFormData}
          handleEditFormChange={handleEditFormChange}
          handleSaveClick={handleSaveClick}
          handleCancelClick={handleCancelClick}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          volunteerName={volunteersData.find(v => v.VolunteerID === volunteerToDelete)?.firstName + " " + volunteersData.find(v => v.VolunteerID === volunteerToDelete)?.lastName}
          handleConfirmDelete={handleConfirmDelete}
          handleCancelDelete={handleCancelDelete}
        />
      )}
    </div>
  );
}
