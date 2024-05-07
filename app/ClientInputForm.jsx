"use client";
import { useState } from "react";
import "app/styles/clientInputForm.css";

const handleAddClient = async () => {
  try {
    const reply = await fetch("/api/createCustomerAccount/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customerEmail,
        customerFname,
        customerLname,
      })
    });

    if (!reply.ok) {
      console.log('Customer already exists');
      return;
    }

    const data = await reply.json();
    console.log(data); // Log the response from the API
  } catch (error) {
    console.error(error); // Log any errors
  }
};

  const [display, setDisplay] = useState(false);
  return (
    <div>
      <button
        class="openButton"
        onClick={() => {
            setDisplay((prevDisplay) => !prevDisplay);
        }}
      >
        Add new client
      </button>

      <div id="formPopUp" style={{ display: display ? "block" : "none" }}>
        <h1>Input Client Information</h1>
        <form class="formContainer">
          <fieldset class="formSections">
            <legend>Full Name:</legend>
            <label>First name</label>
            <br></br>
            <input
              type="text"
              name="clientFirstName"
              autofocus
              required
            ></input>
            <br></br>
            <label>Middle name</label>
            <br></br>
            <input type="text" name="clientMiddleName" optional
            ></input>
            <br></br>
            <label>Last name</label>
            <br></br>
            <input type="text" name="clientLastName" required></input>
          </fieldset>

          <fieldset class="formSections">
            <legend>Contact</legend>
            <label>Address</label>
            <br></br>
            <input type="text" name="clientAddress" required></input>
            <br></br>
            <label>City</label>
            <br></br>
            <input type="text" name="clientCity" required></input>
            <br></br>
            <label>State</label>
            <br></br>
            <input type="text" name="clientState"></input>
            <br></br>

            <label>Phone</label>
            <br></br>
            <input
              type="tel"
              name="clientPhone"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              required
            ></input>
          </fieldset>

          <input type="submit" value="Submit"></input>
          <button
            type="button"
            onClick={() => {
              setDisplay((prevDisplay) => !prevDisplay);
              handleAddClient(); // calls the addClient function
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
