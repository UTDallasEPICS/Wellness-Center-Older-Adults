"use client";

import { useState } from "react";

const ClientInputForm = ({ onSubmit, onClose }) => { // Receive onSubmit and onClose as props
  const [clientInfo, setClientInfo] = useState({
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(clientInfo); // Call the onSubmit prop, passing the client info
    // Optionally clear the form here if you don't want the parent to handle it
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
  };

  return (
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
            onClick={onClose} // Call the onClose prop when the button is clicked
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
  );
};

export default ClientInputForm;