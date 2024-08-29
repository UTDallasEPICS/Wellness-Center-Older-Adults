"use client";
import { useState } from "react";

import "/app/styles/clientInputForm.css";
import "/app/globalicons.css";

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
    event.preventDefault(); // Prevents default form submission

    try {
      const reply = await fetch("/api/createCustomerAccount/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerEmail,
          customerFname,
          customerLname,
        }),
      });

      if (!reply.ok) {
        console.log("Customer already exists");
        return;
      }

      const data = await reply.json();
      console.log(data); // Log the response from the API
    } catch (error) {
      console.error(error); // Log any errors
    }
  };

  return (
    <div>
      <button
        className="openButton"
        onClick={() => setDisplay((prevDisplay) => !prevDisplay)}
      >
        <span className="material-symbols-rounded">add</span>
      </button>

      <div id="formPopUp" style={{ display: display ? "block" : "none" }}>
        <h1>Input Client Information</h1>
        <form className="formContainer" onSubmit={handleAddClient}>
          <fieldset className="formSections">
            <legend>Full Name:</legend>
            <label>First name</label>
            <br />
            <input
              type="text"
              name="clientFirstName"
              autoFocus
              required
              value={customerFname}
              onChange={(e) => setCustomerFName(e.target.value)}
            />
            <br />
            <label>Middle name</label>
            <br />
            <input
              type="text"
              name="clientMiddleName"
              value={customerMname}
              onChange={(e) => setCustomerMName(e.target.value)}
            />
            <br />
            <label>Last name</label>
            <br />
            <input
              type="text"
              name="clientLastName"
              required
              value={customerLname}
              onChange={(e) => setCustomerLName(e.target.value)}
            />
          </fieldset>

          <fieldset className="formSections">
            <legend>Contact</legend>
            <label>Email</label>
            <br />
            <input
              type="email"
              name="clientEmail"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
            <br />
            <label>Address</label>
            <br />
            <input
              type="text"
              name="clientAddress"
              required
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
            <br />
            <label>City</label>
            <br />
            <input
              type="text"
              name="clientCity"
              required
              value={customerCity}
              onChange={(e) => setCustomerCity(e.target.value)}
            />
            <br />
            <label>State</label>
            <br />
            <input
              type="text"
              name="clientState"
              value={customerState}
              onChange={(e) => setCustomerState(e.target.value)}
            />
            <br />
            <label>Phone</label>
            <br />
            <input
              type="tel"
              name="clientPhone"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </fieldset>

          <input type="submit" value="Submit" />
          <button
            type="button"
            className="cancelButton"
            onClick={() => setDisplay((prevDisplay) => !prevDisplay)}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddClientForm;
