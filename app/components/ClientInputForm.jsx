"use client";

import { useState } from "react";

const AddClientForm = () => {
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerFname, setCustomerFName] = useState("");
  const [customerMname, setCustomerMName] = useState("");
  const [customerLname, setCustomerLName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [customerState, setCustomerState] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [display, setDisplay] = useState(false);

const handleAddClient = async (event) => {
  event.preventDefault();

  try {
    const payload = {
      customerEmail,
      firstName: customerFname,
      middleName: customerMname,
      lastName: customerLname,
      streetAddress: customerAddress,
      city: customerCity,
      state: customerState,
      customerPhone,
      zipcode: "75024", 
    };

    console.log("Payload:", payload); 

    const reply = await fetch("/api/createCustomerAccount/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!reply.ok) {
      const errorResponse = await reply.json();
      console.error("Error:", errorResponse.message);
      return;
    }

    const data = await reply.json();
    console.log("Response:", data);
  } catch (error) {
    console.error("Error:", error);
  }
};

  return (
    <div>
      <button
        className="h-[45px] w-[45px] rounded-full text-white bg-black border-none cursor-pointer text-center text-[35px]"
        onClick={() => setDisplay((prevDisplay) => !prevDisplay)}
      >
        <span className="material-symbols-rounded">add</span>
      </button>

      <div
        id="formPopUp"
        className={`fixed top-0 left-0 flex justify-center items-center w-full h-full ${
          display ? "flex" : "hidden"
        }`}
      >
        <form
          className="fixed h-[85%] w-[90%] bg-gray-100 p-8 rounded-lg overflow-y-scroll"
          onSubmit={handleAddClient}
        >
          <h1 className="text-center font-light text-[40px]">Input Client Information</h1>

          <fieldset className="mt-4">
            <legend className="font-light text-[20px]">Full Name:</legend>
            <label className="block text-black text-[15px]">First name</label>
            <input
              type="text"
              name="clientFirstName"
              autoFocus
              required
              value={customerFname}
              onChange={(e) => setCustomerFName(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded mt-1"
            />

            <label className="block mt-4 text-black text-[15px]">Middle name</label>
            <input
              type="text"
              name="clientMiddleName"
              value={customerMname}
              onChange={(e) => setCustomerMName(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded mt-1"
            />

            <label className="block mt-4 text-black text-[15px]">Last name</label>
            <input
              type="text"
              name="clientLastName"
              required
              value={customerLname}
              onChange={(e) => setCustomerLName(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded mt-1"
            />
          </fieldset>

          <fieldset className="mt-4">
            <legend className="font-light text-[20px]">Contact</legend>
            <label className="block text-black text-[15px]">Email</label>
            <input
              type="email"
              name="clientEmail"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded mt-1"
            />

            <label className="block mt-4 text-black text-[15px]">Address</label>
            <input
              type="text"
              name="clientAddress"
              required
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded mt-1"
            />

            <label className="block mt-4 text-black text-[15px]">City</label>
            <input
              type="text"
              name="clientCity"
              required
              value={customerCity}
              onChange={(e) => setCustomerCity(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded mt-1"
            />

            <label className="block mt-4 text-black text-[15px]">State</label>
            <input
              type="text"
              name="clientState"
              value={customerState}
              onChange={(e) => setCustomerState(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded mt-1"
            />

            <label className="block mt-4 text-black text-[15px]">Phone</label>
            <input
              type="tel"
              name="clientPhone"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded mt-1"
            />
          </fieldset>

          <input
            type="submit"
            value="Submit"
            className="mt-6 w-full bg-black text-white py-4 rounded-lg cursor-pointer"
          />
          <button
            type="button"
            onClick={() => setDisplay((prevDisplay) => !prevDisplay)}
            className="mt-4 w-full border border-gray-400 py-4 rounded-lg text-gray-500"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddClientForm;
