"use client";

import { useState } from "react";

// List of US state abbreviations for the dropdown
const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

const ClientInputForm = ({ onSubmit, onClose, initialData = null }) => { 
  const [clientInfo, setClientInfo] = useState({
    firstName: initialData?.firstName || "",
    middleName: initialData?.middleName || "",
    lastName: initialData?.lastName || "",
    address: initialData?.address?.street || initialData?.streetAddress || "",
    city: initialData?.address?.city || initialData?.city || "",
    state: initialData?.address?.state || initialData?.state || "TX",
    phone: initialData?.customerPhone || initialData?.phone || "",
    zipcode: (initialData?.address?.postalCode || initialData?.customerZipCode || "").toString(),
  });

  const [errors, setErrors] = useState({
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields(clientInfo);
    const hasErrors = Object.values(validationErrors).some(Boolean);
    if (hasErrors) {
      setErrors(validationErrors);
      return;
    }

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
    onSubmit(formattedClientInfo);
    // Clear the form
    setClientInfo({
      firstName: "",
      middleName: "",
      lastName: "",
      address: "",
      city: "",
      state: "TX",
      phone: "",
      zipcode: "",
    });
  };

  const validateFields = (data) => {
    const out = { firstName: "", middleName: "", lastName: "", address: "", city: "", state: "", phone: "", zipcode: "" };
    const first = (data.firstName || "").trim();
    const middle = (data.middleName || "").trim();
    const last = (data.lastName || "").trim();
    const address = (data.address || "").trim();
    const city = (data.city || "").trim();
    const state = (data.state || "").trim();
    const zip = (data.zipcode || "").toString().trim();
    const phoneRaw = (data.phone || "").trim();
    const phoneDigits = phoneRaw.replace(/\D/g, "");

    const nameRe = /^[A-Za-z][A-Za-z' -]{0,39}$/; // 1-40 chars letters, space, -, '\'
    const zipRe = /^\d{5}$/;

    if (!first || !nameRe.test(first)) {
      out.firstName = "First name is required and must be 1-40 letters (may include space, - or ').";
    }
    if (middle && !nameRe.test(middle)) {
      out.middleName = "Middle name must be 1-40 letters (may include space, - or ').";
    }
    if (!last || !nameRe.test(last)) {
      out.lastName = "Last name is required and must be 1-40 letters (may include space, - or ').";
    }
    if (!address) {
      out.address = "Street address is required.";
    }
    if (!city) {
      out.city = "City is required.";
    }
    if (!state || !US_STATES.includes(state)) {
      out.state = "Select a valid US state.";
    }
    if (!zip || !zipRe.test(zip)) {
      out.zipcode = "Enter a valid 5-digit ZIP code.";
    }
    if (phoneRaw && phoneDigits.length !== 10) {
      out.phone = "Enter a valid 10-digit phone number or leave blank.";
    }
    return out;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-2xl relative">
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-left font-light text-2xl">{initialData ? "Edit Client" : "Add a Client"}</h2>
            <button
              type="submit"
              className="bg-[#419902] text-white px-6 py-2.5 text-base rounded-lg cursor-pointer hover:bg-[#378300]"
            >
              {initialData ? "Save" : "Add"}
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
                    maxLength={40}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
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
                    maxLength={40}
                />
                {errors.middleName && (
                  <p className="mt-1 text-sm text-red-600">{errors.middleName}</p>
                )}
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
                    maxLength={40}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
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
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
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
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>

            {/* State (Now a dropdown) */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <select
                className="w-full p-2.5 text-sm border border-gray-300 rounded-md"
                name="state"
                value={clientInfo.state}
                onChange={handleChange}
              >
                <option value="" disabled>Select State</option> {/* Default placeholder option */}
                {US_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
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
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
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
              {errors.zipcode && (
                <p className="mt-1 text-sm text-red-600">{errors.zipcode}</p>
              )}
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