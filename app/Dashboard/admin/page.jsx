// app\Dashboard\admin\page.jsx
"use client";
import React, { useState, useEffect } from 'react';
import AddAdminForm from '../../components/AddAdminForm.jsx'; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

// --- Custom Colors and Styles (Using variables for easy reference) ---
const primaryGreen = '#419902'; 
const backgroundOffWhite = '#f4f1f0'; // Tailwind class bg-[#f4f1f0]
const cardBackground = '#ffffff'; 
const headerTextColor = '#000000'; 
const fontLight = '300'; 
const cardBorderColor = '#e0e0e0';

// --- Modal Styles (Inline styles are often kept for fixed/absolute positioning) ---
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
    width: '400px', 
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAdmin),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to add admin');
            }
            toast.success('Admin created successfully!');
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
            const adminId = updatedAdmin.id || adminToEdit.id;
            const response = await fetch(`/api/admin/updateAdmin/${adminId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedAdmin), 
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to update admin');
            }
            toast.success('Admin updated successfully!');
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

        setAdmins(admins.filter(admin => admin.id !== adminIdToDelete));
        setShowDeleteModal(false);
        setAdminToDelete(null);

        try {
            const response = await fetch(`/api/admin/deleteAdmin/${adminIdToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                setAdmins(previousAdminsData);
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to delete admin');
            }
            toast.success("Admin deleted successfully!");
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

    const getAdminFullName = (id) => {
        const admin = admins.find(a => a.id === id);
        return admin ? `${admin.firstName} ${admin.lastName}` : 'this admin';
    };


    if (loading) {
        return (
            <div className={`flex items-center justify-center h-screen bg-[${backgroundOffWhite}]`}>
                <p>Loading Admins...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex items-center justify-center h-screen text-red-500 bg-[${backgroundOffWhite}]`}>
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        // Outermost div: Full width, min height, matching background color
        <div className={`w-full min-h-screen bg-[${backgroundOffWhite}] flex flex-col relative`}>

            {/* Header / Title Row - Matches volunteers page: full width, py-8 px-8 */}
            <div className={`flex flex-row items-center bg-[${backgroundOffWhite}] py-8 px-8`}>
                
                {/* Title */}
                <div className={`text-black text-left font-light text-[30px]`}>
                    <h1>Admins</h1>
                </div>

                {/* Add Button Container - Matches volunteers page: ml-auto flex pr-4 pt-4 */}
                <div className={`ml-auto flex pr-4 pt-4`}>
                    <button
                        type="button"
                        // Tailwind equivalent of addButtonStyles
                        className={`h-[45px] w-[45px] rounded-full text-white bg-[${primaryGreen}] border-none flex items-center justify-center shadow-md text-[14px] font-medium lowercase`}
                        onClick={() => setIsAddAdminModalOpen(true)}
                    >
                        add
                    </button>
                </div>
            </div>

            {/* Main Content Wrapper (Container for the table, centered below the header) */}
            <div className="mt-8 mx-8"> 

                {/* Admin List Container (The main white card-like section) */}
                <div 
                    className={`bg-white rounded-xl shadow-md p-5`} 
                    style={{ 
                        // Using inline styles for specific colors that Tailwind doesn't know by default
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        border: `1px solid ${cardBorderColor}`,
                        // Removing the horizontal padding from outer container (p-5 above handles that)
                        padding: '0 20px', 
                    }}
                >
                    
                    {/* Table Header Row with grid layout */}
                    <div 
                        className="grid py-4 text-gray-700 text-sm font-medium border-b"
                        style={{ 
                            gridTemplateColumns: '1.5fr 1.5fr 2.5fr 1.5fr 1fr', 
                            borderColor: cardBorderColor 
                        }} 
                    >
                        <p>First Name</p>
                        <p>Last Name</p>
                        <p>Email</p>
                        <p>Phone</p>
                        <div className="text-right">Actions</div>
                    </div> 

                    {/* Admin List Rows */}
                    <div className="flex flex-col">
                        {admins.length === 0 ? (
                            <p className="text-center p-5 text-gray-600">No admin users found.</p>
                        ) : (
                            admins.map((admin, index) => (
                                <div 
                                    key={admin.id} 
                                    className={`grid py-4 items-center text-sm text-gray-700`}
                                    style={{ 
                                        gridTemplateColumns: '1.5fr 1.5fr 2.5fr 1.5fr 1fr', 
                                        borderBottom: index < admins.length - 1 ? `1px solid ${cardBorderColor}` : 'none' 
                                    }}
                                >
                                    {/* First Name */}
                                    <p className="font-normal">{admin.firstName}</p>
                                    {/* Last Name */}
                                    <p className="font-normal">{admin.lastName}</p>
                                    {/* Email */}
                                    <p>{admin.email}</p>
                                    {/* Phone */}
                                    <p>{admin.phone || 'N/A'}</p>
                                    {/* Action Buttons */}
                                    <div className="flex justify-end space-x-2">
                                        {/* Edit Button */}
                                        <button
                                            onClick={() => handleEditClick(admin)}
                                            className="h-8 w-[50px] rounded bg-green-600 text-white flex items-center justify-center font-medium text-sm px-2"
                                            style={{ backgroundColor: primaryGreen }}
                                            title="Edit Admin"
                                        >
                                            edit
                                        </button>
                                        
                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDeleteClick(admin.id)}
                                            className="h-8 w-[50px] rounded bg-red-600 text-white flex items-center justify-center font-medium text-sm px-2"
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

            {/* Modals - Remain the same, using inline styles for fixed positioning */}
            {isAddAdminModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <button style={modalCloseButtonStyle} onClick={() => setIsAddAdminModalOpen(false)}>&times;</button>
                        <h2 className="text-left font-light text-2xl mb-4">Add New Admin</h2>
                        <AddAdminForm onSubmit={handleAddAdminSubmit} onClose={() => setIsAddAdminModalOpen(false)} />
                    </div>
                </div>
            )}

            {isEditAdminModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <button style={modalCloseButtonStyle} onClick={() => setIsEditAdminModalOpen(false)}>&times;</button>
                        <h2 className="text-left font-light text-2xl mb-4">Edit Admin</h2>
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
                        <p className="mb-5 text-base">
                            Are you sure you want to delete admin: 
                            <strong className="ml-1">{getAdminFullName(adminToDelete)}</strong>?
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button onClick={handleCancelDelete} className="bg-gray-400 text-gray-800 px-4 py-2 rounded cursor-pointer border-none">
                                Cancel
                            </button>
                            <button onClick={handleConfirmDelete} className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer border-none">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}