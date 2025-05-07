"use client";
import React, { useState, useEffect } from 'react';
import Header from "/app/components/Header.jsx";
import AddAdminForm from '../../components/AddAdminForm.jsx';

export default function AdminPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/getAdmin'); // Updated API endpoint
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
      const response = await fetch('/api/admin/addAdmin', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAdmin),
      });

      if (!response.ok) {
        throw new Error('Failed to add admin');
      }

      fetchAdmins();
      // Optionally show a success message
    } catch (error) {
      console.error('Error adding admin:', error);
      // Optionally show an error message
    }
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
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '32px' }}>
        <div style={{ color: 'black', textAlign: 'left', fontWeight: '300', fontSize: '30px' }}>
          <h1>Admin Page</h1>
        </div>
        <div style={{ marginLeft: 'auto', paddingRight: '24px' }}>
          <button
            type="button"
            style={{ height: '45px', width: '45px', borderRadius: '50%', color: 'white', backgroundColor: 'black', border: 'none', position: 'absolute', top: '8px', right: '16px', zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}
            onClick={() => setIsAddAdminModalOpen(true)}
          >
            <span style={{ fontFamily: 'sans-serif', fontSize: '20px' }}>+</span>
          </button>
        </div>
        {/* You can add an edit button for admins here if needed */}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', color: 'black', padding: '24px', fontSize: '15px', fontWeight: '300', backgroundColor: 'white', borderBottom: '1px solid #ccc', width: '100%' }}>
        <p>Name</p>
        <p>Email</p>
        {/* Add more columns if your admin data has more fields */}
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', color: 'black', backgroundColor: 'white', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>
        {admins.map((admin, index) => (
          <div key={index} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', padding: '16px 24px', borderBottom: '1px solid #ccc' }}>
            <p>{`${admin.firstName} ${admin.lastName}`}</p>
            <p>{admin.email}</p>
            {/* Display more admin data here */}
          </div>
        ))}
      </div>

      {/* Add Admin Modal */}
      {isAddAdminModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
            <AddAdminForm onSubmit={handleAddAdminSubmit} onClose={() => setIsAddAdminModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
