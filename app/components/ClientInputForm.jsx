// /app/components/ClientInputForm.jsx
"use client";

import { useState } from "react";

const ClientInputForm = () => {
  const [clientInfo, setClientInfo] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    zipcode: "", // Added zipcode to the state
    birthdate: "", // Added birthdate to the state
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/createCustomerAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail: clientInfo.email,
          firstName: clientInfo.firstName,
          lastName: clientInfo.lastName,
          middleName: clientInfo.middleName,
          customerPhone: clientInfo.phone,
          streetAddress: clientInfo.address,
          city: clientInfo.city,
          state: clientInfo.state,
          customerZipCode: parseInt(clientInfo.zipcode),
          birthdate: clientInfo.birthdate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Customer created successfully:', data);
        alert('Customer account created successfully!');
        // Optionally clear the form after successful submission
        setClientInfo({
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          address: "",
          city: "",
          state: "",
          phone: "",
          zipcode: "",
          birthdate: "",
        });
      } else {
        console.error('Failed to create customer:', data);
        alert(`Failed to create customer: ${data.message || 'An error occurred.'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An unexpected error occurred while submitting the form.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h1 className="block text-gray-700 text-2xl font-bold mb-6 text-center">Input Client Information</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
              Full Name:
            </label>
            <div className="grid grid-cols-3 gap-x-2">
              <div>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  value={clientInfo.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="middleName"
                  type="text"
                  placeholder="Middle Name"
                  name="middleName"
                  value={clientInfo.middleName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  value={clientInfo.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex justify-between text-gray-700 text-xs mt-1">
              <span>First</span>
              <span>Middle</span>
              <span>Last</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Contact
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
              id="email"
              type="email"
              placeholder="Email"
              name="email"
              value={clientInfo.email}
              onChange={handleChange}
            />
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
              id="address"
              type="text"
              placeholder="Address"
              name="address"
              value={clientInfo.address}
              onChange={handleChange}
            />
            <div className="grid grid-cols-2 gap-x-2 mb-2">
              <div>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="city"
                  type="text"
                  placeholder="City"
                  name="city"
                  value={clientInfo.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="state"
                  type="text"
                  placeholder="State"
                  name="state"
                  value={clientInfo.state}
                  onChange={handleChange}
                />
              </div>
            </div>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              type="tel"
              placeholder="Phone"
              name="phone"
              value={clientInfo.phone}
              onChange={handleChange}
            />
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="zipcode"
              type="text"
              placeholder="Zip Code"
              name="zipcode"
              value={clientInfo.zipcode}
              onChange={handleChange}
            />
            <label className="block text-gray-700 text-sm font-bold mb-2 mt-2" htmlFor="birthdate">
              Birthdate:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="birthdate"
              type="date"
              name="birthdate"
              value={clientInfo.birthdate}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Cancel
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientInputForm;