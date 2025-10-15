"use client";

import { useState } from "react";

const ClientInputForm = ({ onSubmit, onClose }) => { // Receive onSubmit and onClose as props
  const [clientInfo, setClientInfo] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    zipcode: "",
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
    const formattedClientInfo = {
      firstName: clientInfo.firstName,
      middleName: clientInfo.middleName,
      lastName: clientInfo.lastName,
      customerPhone: clientInfo.phone,
      streetAddress: clientInfo.address,
      city: clientInfo.city,
      state: clientInfo.state,
      customerZipCode: clientInfo.zipcode,
    };
    onSubmit(formattedClientInfo); // Call the onSubmit prop with the formatted data
    // Optionally clear the form here if you don't want the parent to handle it
    setClientInfo({
      firstName: "",
      middleName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      phone: "",
      zipcode: "",
    });
  };

  return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-2xl relative">
                <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-left font-light text-2xl">Add a Client</h2>
                        <button
                            type="submit"
                            className="bg-[#419902] text-white px-6 py-2.5 text-base rounded-lg cursor-pointer hover:bg-[#378300]"
                        >
                            Add
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[70vh]">
                        {/* First Name */}
                        <div>
                            <label htmlFor="clientFirstName" className="block text-sm font-medium text-gray-700">
                                First Name
                            </label>
                            <input
                                className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                                name="firstName"
                                value={clientInfo.firstName}
                                placeholder="First Name"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Middle Name */}
                        <div>
                            <label htmlFor="clientMiddleName" className="block text-sm font-medium text-gray-700">
                                Middle Name
                            </label>
                            <input
                                className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                                type="text"
                                name="middleName"
                                placeholder="Middle Name"
                                value={clientInfo.middleName}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label htmlFor="clientLastName" className="block text-sm font-medium text-gray-700">
                                Last Name
                            </label>
                            <input
                                className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={clientInfo.lastName}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">
                                Street Address
                            </label>
                            <input
                                className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                                type="text"
                                name="address"
                                placeholder="Street Address"
                                value={clientInfo.address}
                                onChange={handleChange}
                            />
                        </div>

                        {/* City */}
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                City
                            </label>
                            <input
                                className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                                type="text"
                                name="city"
                                placeholder="City"
                                value={clientInfo.city}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone
                            </label>
                            <input
                                className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={clientInfo.phone}
                                maxLength={11}
                                inputMode="numeric"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Zip Code */}
                        <div>
                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                                Zip Code
                            </label>
                            <input
                                className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                                type="text"
                                name="zipcode"
                                placeholder="Zip Code"
                                value={clientInfo.zipcode}
                                pattern="[0-9]{5}"
                                maxLength={5}
                                inputMode="numeric"
                                onChange={handleChange}
                            />
                        </div>

                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                        <button
                            className="bg-[#e2dbd0]/70 text-[gray-700] px-6 py-2.5 text-base rounded-lg cursor-pointer hover:bg-[#e2dbd0]"
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
  );
};

export default ClientInputForm;