"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from "../../providers/Auth";

export default function AccountPage() {
  const { handleLogout } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    isVolunteer: false,
    volunteerStatus: '',
    assignedRides: [],
  });
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        const response = await fetch('/api/user/profile');

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        const [firstName, ...lastNameParts] = data.user.fullName.split(' ');
        const lastName = lastNameParts.join(' ');

        setFormData({
          firstName: firstName || '',
          lastName: lastName || '',
          email: data.user.email,
          phone: data.user.phone,
          username: data.user.username,
          isVolunteer: data.user.isVolunteer,
          volunteerStatus: data.user.volunteerStatus,
          assignedRides: data.user.assignedRides,
        });
        setProfilePic(data.user.profilePicUrl);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
      };

      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update account information');
      }
      alert('Account information updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('profilePic', file);

      try {
        const response = await fetch('/api/upload/profile-pic', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Failed to upload profile picture');
        }
        const result = await response.json();
        setProfilePic(result.url);
      } catch (err) {
        console.error('Upload error:', err);
      }
    }
  };

  const handlePasswordChange = () => {
    alert('Password change functionality is not configured.');
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading user data...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-xl mx-auto my-10 p-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">Volunteer Account</h1>

      <div className="flex flex-col items-center mb-8">
        <label htmlFor="profile-pic-upload" className="cursor-pointer">
          <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:bg-gray-100 transition-colors">
            {profilePic ? (
              <Image src={profilePic} alt="Profile" width={128} height={128} className="object-cover w-full h-full" />
            ) : (
              <span className="text-sm text-gray-500">Upload Profile Pic</span>
            )}
          </div>
        </label>
        <input
          id="profile-pic-upload"
          type="file"
          accept="image/*"
          onChange={handleProfilePicChange}
          className="hidden"
        />
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>


        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
      </form>

      {formData.isVolunteer && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Volunteer Information</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">
              **Status:** <span className="font-bold">{formData.volunteerStatus}</span>
            </p>
            {formData.assignedRides.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-700">Assigned Rides</h3>
                <ul className="mt-2 space-y-2">
                  {formData.assignedRides.map(ride => (
                    <li key={ride.id} className="p-3 bg-white rounded-md shadow-sm">
                      <p className="font-semibold text-sm">Ride on {new Date(ride.date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">Pickup at {new Date(ride.pickupTime).toLocaleTimeString()}</p>
                      <p className="text-xs text-gray-500">From: {ride.addrStart.street}</p>
                      <p className="text-xs text-gray-500">To: {ride.addrEnd?.street || 'N/A'}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={handlePasswordChange}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Change Password
        </button>
        <button
          onClick={handleLogout}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
}