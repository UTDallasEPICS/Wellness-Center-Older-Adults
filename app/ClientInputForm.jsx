"use client";
import { useState } from "react";
import "app/styles/clientInputForm.css";
import customerQuery from "../prisma/customerQueries"; // importing customerQuery

const [clientFirstName, setClientFirstName] = useState("");
const [clientMiddleName, setClientMiddleName] = useState("");
const [clientLastName, setClientLastName] = useState("");
const [clientAddress, setClientAddress] = useState("");
const [clientCity, setClientCity] = useState("");
const [clientState, setClientState] = useState("");
const [clientPhone, setClientPhone] = useState("");

const handleAddClient = async () => {
  const reply = await fetch("http://localhost:3000/api/customer/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      clientFirstName,
      clientMiddleName,
      clientLastName,
      clientAddress,
      clientCity,
      clientState,
      clientPhone
    })
  });

          if(!reply.ok) // if customer doesn't exist
          {
            await customerQuery(); // calls customerQuery
          };
  }// end addClient

  return (
    <div>
      <button
        class="openButton"
        onClick={() => {
            setDisplay((prevDisplay) => !prevDisplay);
            handleAddClient(); // calls the addClient function
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
              value={clientFirstName}
              onChange={(e) => setClientFirstName(e.target.value)}
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
            onClick={() => setDisplay((prevDisplay) => !prevDisplay)}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
