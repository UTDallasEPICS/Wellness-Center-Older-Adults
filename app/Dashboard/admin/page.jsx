"use client";
import React, { useState, useEffect } from 'react';
import Header from "/app/components/Header.jsx";
import AddAdminForm from '../../components/AddAdminForm.jsx';
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
                throw new Error(`Failed to fetch admin data: ${response.status}`);
            }
            const data = await response.json();
            setAdmins(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching admins:', error);
            setError('Failed to load admin data');
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
                body: JSON.stringify({
                    email: newAdmin.email,
                    firstName: newAdmin.firstName,
                    lastName: newAdmin.lastName,
                    phone: newAdmin.phone,
                }),
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
            const response = await fetch(`/api/admin/updateAdmin/${adminToEdit.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: updatedAdmin.email,
                    firstName: updatedAdmin.firstName,
                    lastName: updatedAdmin.lastName,
                    phone: updatedAdmin.phone,
                }),
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
        console.log("Delete button clicked for AdminID:", adminId);
        setAdminToDelete(adminId);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        console.log("handleConfirmDelete called. adminToDelete:", adminToDelete);
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

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <p>Loading Admins...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'red' }}>
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'white', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <Header />
              <div className="flex flex-row items-center bg-[#f4f1f0] py-8 px-8">
                <div className="text-black text-left font-light text-[30px]">
                    <h1>Admins</h1>
                </div>
                <div style={{ marginLeft: 'auto', paddingRight: '24px' }}>
                    <button
                        type="button"
                        style={{ height: '45px', width: '45px', borderRadius: '50%', color: 'white', backgroundColor: 'black', border: 'none', zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}
                        onClick={() => setIsAddAdminModalOpen(true)}
                    >
                        <span className="material-symbols-rounded">add</span>
                    </button>
                </div>
            </div>

            {/* Header row - Changed gridTemplateColumns from 'repeat(3, minmax(0, 1fr)) auto' to '1fr 1fr 1fr auto' for better alignment */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', color: 'black', padding: '24px', fontSize: '15px', fontWeight: '300', backgroundColor: 'white', borderBottom: '1px solid #ccc', width: '100%' }}>
                <p>Name</p>
                <p>Email</p>
                <p>Phone</p>
                {/* Added fixed width to match button column below */}
                <div style={{ width: '80px' }}></div>
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', color: 'black', backgroundColor: 'white', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>
                {admins.map((admin, index) => (
                    // Changed gridTemplateColumns to match header row for proper alignment
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', padding: '16px 24px', borderBottom: '1px solid #ccc', alignItems: 'center' }}>
                        <p>{`${admin.firstName} ${admin.lastName}`}</p>
                        <p>{admin.email}</p>
                        <p>{admin.phone || 'N/A'}</p>
                        {/* Added fixed width of 80px to button container for consistent alignment */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', width: '80px' }}>
                            <button
                                onClick={() => handleEditClick(admin)}
                                style={{ color: 'blue', cursor: 'pointer' }}
                            >
                                <span className="material-symbols-rounded">edit</span>
                            </button>
                            <button
                                onClick={() => handleDeleteClick(admin.id)}
                                style={{ color: 'red', cursor: 'pointer' }}
                            >
                                <span className="material-symbols-rounded">delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

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
                        <p style={{ marginBottom: '16px' }}>Are you sure you want to delete admin: {admins.find(a => a.id === adminToDelete)?.firstName} {admins.find(a => a.id === adminToDelete)?.lastName}?</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={handleCancelDelete} style={{ backgroundColor: '#ccc', color: '#333', padding: '8px 16px', borderRadius: '4px', marginRight: '8px', cursor: 'pointer' }}>
                                Cancel
                            </button>
                            <button onClick={handleConfirmDelete} style={{ backgroundColor: 'red', color: 'white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}