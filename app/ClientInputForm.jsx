"use client";
import { useState } from "react";
import "app/styles/clientInputForm.css";
import axios from "axios"; // used for https requests
import customerQuery from "../prisma/customerQueries"; // importing customerQuery

export default function ClientInputForm() {
  const [display, setDisplay] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerFName, setCustomerFName] = useState("");
  const [customerLName, setCustomerLName] = useState("");

  const addClient = async() =>
  {
    const reply = await axios.post("/api/customer/check", {
        customerEmail,
        customerFName,
        customerLName
    });

        if(!reply.data) // if customer doesn't exist
        {
            await customerQuery(); // calls customerQuery
        };
    }
  }

  return (
    <div>
      <button
        class="openButton"
        onClick={() => {
            setDisplay((prevDisplay) => !prevDisplay);
            addClient(); // calls the addClient function
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
            <input type="text" name="clientMiddleName" optional></input>
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
            onClick={() => setDisplay((prevDisplay) => !prevDisplay)}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
