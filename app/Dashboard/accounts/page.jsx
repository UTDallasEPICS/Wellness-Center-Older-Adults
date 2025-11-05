"use client";

import { useState, useEffect } from "react";
// Replaced "next/image" with <img> to ensure compatibility
import { X, Bell, Plus, Trash2 } from "lucide-react"; // Using lucide-react for icons

// Mock implementation for demonstration purposes (replace with your actual auth/provider logic)
const useAuth = () => ({
  handleLogout: () => console.log("Logout triggered"),
});

// Utility component for the custom notification list item
const NotificationRow = ({ notification, onChange, onRemove, timeOptions }) => (
  <div
    key={notification.id}
    className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 transition-shadow hover:shadow-md"
  >
    <div className="flex-grow w-full sm:w-auto">
      <label className="block text-xs font-medium text-gray-500 mb-1">
        Time Before Ride
      </label>
      <select
        value={notification.value}
        onChange={(e) => onChange(notification.id, "value", e.target.value)}
        // Green focus ring for inputs
        className="w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-green-500 focus:ring-green-500" 
      >
        {timeOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>

    <div className="flex-grow w-full sm:w-auto">
      <label className="block text-xs font-medium text-gray-500 mb-1">
        Preferred Time (Email)
      </label>
      <input
        type="time"
        value={notification.preferredTime}
        onChange={(e) => onChange(notification.id, "preferredTime", e.target.value)}
        // Green focus ring for inputs
        className="w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-green-500 focus:ring-green-500" 
      />
    </div>
    
    <div className="flex-shrink-0 pt-5 sm:pt-4">
      <button
        type="button"
        onClick={() => onRemove(notification.id)}
        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
        title="Remove notification"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  </div>
);


export default function AccountPage() {
  const { handleLogout } = useAuth();

  const [notificationSettings, setNotificationSettings] = useState([
    { id: Date.now(), value: '24', preferredTime: '09:00' },
  ]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    isVolunteer: false,
    volunteerStatus: "",
    assignedRides: [],
    birthdate: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Time options including day-based reminders (from user's last input)
  const timeOptions = [
    { value: '14 Days', label: '14 days before' },
    { value: '13 Days', label: '13 days before' }, 
    { value: '12 Days', label: '12 days before' },
    { value: '11 Days', label: '11 days before' },
    { value: '10 Days', label: '10 days before' }, 
    { value: '9 Days', label: '9 days before' },
    { value: '8 Days', label: '8 days before' },
    { value: '7 Days', label: '7 days before' },
    { value: '6 Days', label: '6 days before' },
    { value: '5 Days', label: '5 days before' },
    { value: '4 Days', label: '4 days before' },
    { value: '3 Days', label: '3 days before' },
    { value: '2', label: '2 hours before ride' },
    { value: '6', label: '6 hours before ride' },
    { value: '12', label: '12 hours before ride'},
    { value: '14', label: '14 hours before ride'},
    { value: '24', label: '24 hours before (1 day)' },
    { value: '48', label: '48 hours before (2 days)' },
  ];

  const showMessage = (type, message) => {
    if (type === 'success') {
      setSuccessMessage(message);
      setErrorMessage(null);
    } else {
      setErrorMessage(message);
      setSuccessMessage(null);
    }
    setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 5000);
  };

  const handleAddNotification = () => {
    // Default to 14 days before
    setNotificationSettings([
      ...notificationSettings,
      { id: Date.now() + Math.random(), value: '14 Days', preferredTime: '18:00' }, 
    ]);
  };

  const handleRemoveNotification = (id) => {
    setNotificationSettings(notificationSettings.filter(n => n.id !== id));
  };

  const handleNotificationChange = (id, field, value) => {
    setNotificationSettings(notificationSettings.map(n =>
      n.id === id ? { ...n, [field]: value } : n
    ));
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        // Mocking API response for demonstration
        const mockResponse = {
          ok: true,
          json: async () => ({
            user: {
              fullName: "Jane Doe",
              email: "jane.doe@example.com",
              phone: "555-123-4567",
              isVolunteer: true,
              volunteerStatus: "available",
              assignedRides: [
                { id: 'r1', date: Date.now() + 86400000, pickupTime: Date.now() + 86400000 + 36000000, addrStart: { street: '123 Main St' } },
              ],
              notificationSettings: [
                { id: 1, value: '24', preferredTime: '08:00' },
                { id: 2, value: '14 Days', preferredTime: '18:00' }
              ]
            }
          })
        };
        const response = mockResponse; // Replace with await fetch("/api/user/profile");

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        const user = data.user;
        let firstName = user.firstName || "";
        let lastName = user.lastName || "";
        
        if ((!firstName || !lastName) && user.fullName) {
          const [f, ...l] = user.fullName.split(" ");
          firstName = f;
          lastName = l.join(" ");
        }

        setFormData({
          firstName,
          lastName,
          email: user.email || "",
          phone: user.phone || "",
          isVolunteer: user.isVolunteer || false,
          volunteerStatus: user.volunteerStatus || "",
          assignedRides: user.assignedRides || [],
          birthdate: user.birthdate || "",
        });
        
        if (user.notificationSettings && user.notificationSettings.length > 0) {
          const loadedSettings = user.notificationSettings.map((n, index) => ({
            ...n,
            id: Date.now() + index,
          }));
          setNotificationSettings(loadedSettings);
        }

        setProfilePic(user.profilePicUrl || null);
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
        volunteerStatus: formData.volunteerStatus,
        notificationSettings: notificationSettings.map(n => ({
          value: n.value,
          preferredTime: n.preferredTime,
        })),
      };

      // Mock API call
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ success: true })
      };
      const response = mockResponse; // Replace with actual fetch call

      if (!response.ok) {
        throw new Error("Failed to update account information");
      }
      showMessage("success", "Account and notification settings updated successfully!");
    } catch (err) {
      showMessage("error", err.message || "An unknown error occurred during save.");
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
      formData.append("profilePic", file);

      try {
        // Mock API call
        const mockResponse = {
          ok: true,
          json: async () => ({ url: "https://placehold.co/128x128/7f9cf5/ffffff?text=New+Pic" })
        };
        const response = mockResponse; // Replace with actual fetch call

        if (!response.ok) {
          throw new Error("Failed to upload profile picture");
        }
        const result = await response.json();
        setProfilePic(result.url);
      } catch (err) {
        console.error("Upload error:", err);
      }
    }
  };

  const handlePasswordChange = () => {
    showMessage("error", "Password change functionality is not configured in this demo.");
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Loading user data...
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-xl mx-auto my-10 p-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">
        Volunteer Account
      </h1>
      
      {/* --- Custom Message Box --- */}
      {(successMessage || errorMessage) && (
        <div 
          className={`p-4 mb-4 rounded-lg flex items-center justify-between transition-opacity duration-300 ${successMessage ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          role="alert"
        >
          <span>
            {successMessage || errorMessage}
          </span>
          <button onClick={() => { setSuccessMessage(null); setErrorMessage(null); }} className="p-1 rounded-full hover:bg-opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      {/* -------------------------- */}


      <div className="flex flex-col items-center mb-8">
        <label htmlFor="profile-pic-upload" className="cursor-pointer group">
          <div className="w-32 h-32 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:bg-gray-100 transition-colors relative group-hover:shadow-xl">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-sm text-gray-500">Upload Profile Pic</span>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                <span className="text-white text-sm font-semibold">Change</span>
            </div>
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
            type="text" id="firstName" name="firstName" value={formData.firstName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text" id="lastName" name="lastName" value={formData.lastName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email" id="email" name="email" value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel" id="phone" name="phone" value={formData.phone}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
          disabled={loading}
        >
          {loading ? 'Saving Changes...' : 'Save All Changes'}
        </button>

        {/* --- NOTIFICATION SETTINGS SECTION --- */}
        <div className="pt-6 border-t border-gray-200"> 
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-green-600"/> Reminder Notifications
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Set custom email reminders for your assigned rides. Specify how long before the ride you want the email, and what time of day you prefer to receive it.
          </p>

          <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200"> {/* Green box accent */}
            {notificationSettings.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                onChange={handleNotificationChange}
                onRemove={handleRemoveNotification}
                timeOptions={timeOptions}
              />
            ))}

            <button
              type="button"
              onClick={handleAddNotification}
              className="w-full flex items-center justify-center py-2 px-4 border border-green-300 shadow-sm text-sm font-medium rounded-lg text-green-700 bg-white hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150"
            >
              <Plus className="w-4 h-4 mr-2 text-green-700" /> Add Another Reminder
            </button>
          </div>
        </div>
        {/* --- END NOTIFICATION SETTINGS SECTION --- */}

      </form>
      {/* --- Volunteer Info Section --- */}
      {formData.isVolunteer && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Volunteer Information
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div>
              <label
                htmlFor="volunteerStatus"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="volunteerStatus"
                name="volunteerStatus"
                value={formData.volunteerStatus}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            {formData.assignedRides.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-700">Assigned Rides</h3>
                <ul className="mt-2 space-y-2">
                  {formData.assignedRides.map((ride) => (
                    <li
                      key={ride.id}
                      className="p-3 bg-white rounded-md shadow-sm"
                    >
                      <p className="font-semibold text-sm text-green-600">
                        Ride on {new Date(ride.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Pickup at{" "}
                        {new Date(ride.pickupTime).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        From: {ride.addrStart?.street || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        To: {ride.addrEnd?.street || "N/A"}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      {/* --- End Volunteer Info Section --- */}

      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={handlePasswordChange}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" // Green focus ring
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