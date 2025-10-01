// app\Dashboard\admin\page.jsx
"use client";
import React, { useState, useEffect } from 'react';
import Header from "/app/components/Header.jsx";
import AddAdminForm from '../../components/AddAdminForm.jsx'; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

// --- Custom Colors and Styles from Image ---
const primaryGreen = '#419902'; // Bright green from the 'add' button and 'edit' button
const backgroundOffWhite = '#f4f1f0'; // Main page background
const cardBackground = '#ffffff'; // The table card background
const headerTextColor = '#000000'; // Black text for the main title
const fontLight = '300'; // Light font weight for title
// Assumed sidebar width based on previous context/screenshots
const sidebarWidth = '80px'; 

// --- Modal Styles (Kept as inline styles for simplicity) ---
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
    width: '400px', // Set a fixed width for modals
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
// --- END Modal Styles ---

// Style for the "Add Admin" button (plus icon)
const addButtonStyles = {
    height: '45px',
    width: '45px',
    borderRadius: '50%',
    color: 'white',
    backgroundColor: primaryGreen,
    border: 'none',
    zIndex: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
    fontSize: '20px',
};

// Style for the Edit button
const editButtonStyles = {
    height: '32px',
    width: '50px',
    borderRadius: '4px',
    backgroundColor: primaryGreen,
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    fontSize: '14px',
    padding: '0 10px',
};

// Style for the Delete button
const deleteButtonStyles = {
    height: '32px',
    width: '50px',
    borderRadius: '4px',
    backgroundColor: '#d9534f', // Red color
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    fontSize: '14px',
    padding: '0 10px',
};


export default function AdminPage() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
    const [isEditAdminModalOpen, setIsEditAdminModalOpen] = useState(false);
    const [adminToEdit, setAdminToEdit] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState(null);

    const fetchAdmins = async () => {
        try {
            const response = await fetch('/api/getAdmin');
            if (!response.ok) {
                // Read error message from body if available
                const errorData = await response.json().catch(() => ({ message: `Failed to fetch admin data: ${response.status}` }));
                throw new Error(errorData.message);
            }
            const data = await response.json();
            setAdmins(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching admins:', error);
            setError(error.message || 'Failed to load admin data');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleAddAdminSubmit = async (newAdmin) => {
        setIsAddAdminModalOpen(false);

        try {
            const response = await fetch('/api/admin/addAdmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAdmin),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to add admin');
            }

            toast.success('Admin created successfully!');
            // Only reload on success to ensure the list is refreshed
            window.location.reload(); 
        } catch (error) {
            console.error('Error adding admin:', error);
            toast.error(error.message || 'Failed to add admin.');
        }
    };

    const handleEditClick = (admin) => {
        setAdminToEdit(admin);
        setIsEditAdminModalOpen(true);
    };

    const handleEditAdminSubmit = async (updatedAdmin) => {
        setIsEditAdminModalOpen(false);

        try {
            // Ensure ID is passed correctly, assuming updatedAdmin already contains the ID if edited within the form,
            // otherwise use adminToEdit.id
            const adminId = updatedAdmin.id || adminToEdit.id;
            
            const response = await fetch(`/api/admin/updateAdmin/${adminId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Pass the updated data
                body: JSON.stringify(updatedAdmin), 
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to update admin');
            }

            toast.success('Admin updated successfully!');
            // Only reload on success to ensure the list is refreshed
            window.location.reload();
        } catch (error) {
            console.error('Error updating admin:', error);
            toast.error(error.message || 'Failed to update admin.');
        }
    };

    const handleDeleteClick = (adminId) => {
        setAdminToDelete(adminId);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        const adminIdToDelete = adminToDelete;
        const previousAdminsData = [...admins];

        // Optimistic UI update
        setAdmins(admins.filter(admin => admin.id !== adminIdToDelete));
        setShowDeleteModal(false);
        setAdminToDelete(null);

        try {
            const response = await fetch(`/api/admin/deleteAdmin/${adminIdToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                // Revert optimistic update on failure
                setAdmins(previousAdminsData);
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to delete admin');
            }

            toast.success("Admin deleted successfully!");
            // Only reload on success to ensure the list is refreshed
            window.location.reload();
        } catch (error) {
            console.error('Error deleting admin:', error);
            toast.error(error.message || "Failed to delete admin.");
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setAdminToDelete(null);
    };

    // Helper to find the full name for the delete modal
    const getAdminFullName = (id) => {
        const admin = admins.find(a => a.id === id);
        return admin ? `${admin.firstName} ${admin.lastName}` : 'this admin';
    };


    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: backgroundOffWhite }}>
                <p>Loading Admins...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'red', backgroundColor: backgroundOffWhite }}>
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'white', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <Header />
              <div className="flex flex-row items-center bg-[#f4f1f0] py-8 px-8"> {/* Header */}
                <div className="text-black text-left font-light text-[30px]">
                    <h1>Admins</h1>
                </div>
                <div style={{ marginLeft: 'auto', paddingRight: '24px' }}>
                  
                    <button
                        type="button"
                        style={addButtonStyles}
                        onClick={() => setIsAddAdminModalOpen(true)}
                    >
                        <span className="material-symbols-rounded">add</span>
                    </button>
                </div>

                {/* Admin List Container (The main white card-like section) */}
                <div style={{ 
                    backgroundColor: cardBackground, 
                    borderRadius: '12px', 
                    padding: '0 20px', 
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', 
                    border: '1px solid #f0f0f0', 
                    width: '100%', 
                    maxWidth: 'none', 
                }}>
                    
                    {/* Header Row */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr 2fr 1fr 1fr', 
                        color: '#333', 
                        padding: '16px 0', 
                        fontSize: '15px', 
                        fontWeight: '400', 
                        borderBottom: '1px solid #e0e0e0', 
                        fontFamily: 'sans-serif',
                    }}>
                        <p style={{ fontWeight: '500' }}>First Name</p>
                        <p style={{ fontWeight: '500' }}>Last Name</p>
                        <p style={{ fontWeight: '500' }}>Email</p>
                        <p style={{ fontWeight: '500' }}>Phone</p>
                        <div style={{ textAlign: 'right', fontWeight: '500' }}>Actions</div>
                    </div>

                    {/* Admin List Rows */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {admins.length === 0 ? (
                            <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No admin users found.</p>
                        ) : (
                            admins.map((admin, index) => (
                                <div key={admin.id} style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: '1fr 1fr 2fr 1fr 1fr', 
                                    padding: '16px 0', 
                                    alignItems: 'center',
                                    borderBottom: index < admins.length - 1 ? '1px solid #f0f0f0' : 'none', 
                                    fontSize: '15px',
                                }}>
                                    {/* First Name */}
                                    <p style={{ fontWeight: 'normal', color: '#333' }}>{admin.firstName}</p>
                                    {/* Last Name */}
                                    <p style={{ fontWeight: 'normal', color: '#333' }}>{admin.lastName}</p>
                                    {/* Email */}
                                    <p style={{ fontSize: '15px', color: '#333' }}>{admin.email}</p>
                                    {/* Phone */}
                                    <p style={{ fontSize: '15px', color: '#333' }}>{admin.phone || 'N/A'}</p>
                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                        {/* Edit Button */}
                                        <button
                                            onClick={() => handleEditClick(admin)}
                                            style={editButtonStyles}
                                            title="Edit Admin"
                                        >
                                            edit
                                        </button>
                                        
                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDeleteClick(admin.id)}
                                            style={deleteButtonStyles}
                                            title="Delete Admin"
                                        >
                                            delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Modals - Remain the same */}
            {isAddAdminModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <button style={modalCloseButtonStyle} onClick={() => setIsAddAdminModalOpen(false)}>&times;</button>
                        <h2 style={{ textAlign: 'left', fontWeight: '300', fontSize: '24px', marginBottom: '16px' }}>Add New Admin</h2>
                        <AddAdminForm onSubmit={handleAddAdminSubmit} onClose={() => setIsAddAdminModalOpen(false)} />
                    </div>
                </div>
            )}

            {isEditAdminModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <button style={modalCloseButtonStyle} onClick={() => setIsEditAdminModalOpen(false)}>&times;</button>
                        <h2 style={{ textAlign: 'left', fontWeight: '300', fontSize: '24px', marginBottom: '16px' }}>Edit Admin</h2>
                        <AddAdminForm
                            onSubmit={handleEditAdminSubmit}
                            onClose={() => setIsEditAdminModalOpen(false)}
                            initialData={adminToEdit}
                        />
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <button style={modalCloseButtonStyle} onClick={handleCancelDelete}>&times;</button>
                        <p style={{ marginBottom: '20px', fontSize: '16px' }}>
                            Are you sure you want to delete admin: 
                            <strong style={{ marginLeft: '4px' }}>{getAdminFullName(adminToDelete)}</strong>?
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button onClick={handleCancelDelete} style={{ backgroundColor: '#ccc', color: '#333', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', border: 'none' }}>
                                Cancel
                            </button>
                            <button onClick={handleConfirmDelete} style={{ backgroundColor: '#d9534f', color: 'white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', border: 'none' }}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
