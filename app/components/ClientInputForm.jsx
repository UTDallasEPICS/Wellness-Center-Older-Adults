"use client";
import { useState } from "react";
import "app/styles/clientInputForm.css";
import "app/globalicons.css";

export default function ClientInputForm() {
  const [display, setDisplay] = useState(false);

  return (
    <div>
      <button
        class="openButton"
        onClick={() => setDisplay((prevDisplay) => !prevDisplay)}
      >
        <span class="material-symbols-rounded">add</span>
      </button>

      <div
        id="overlayContainer"
        style={{ display: display ? "block" : "none" }}
      >
        <div className="popUpBox">
          <form class="formContainer">
            <h1>Input Client Information</h1>
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
              <br></br>
              <label>Birthdate</label>
              <br></br>
              <input type="text" name="clientBirthdate"></input>
              <br></br>
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
              <label>Email</label>
              <br></br>
              <input type="text" name="clientEmail"></input>
              <br></br>

              <label>Phone</label>
              <br></br>
              <input
                type="tel"
                name="clientPhone"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                required
              ></input>
              <br></br>
            </fieldset>

            <input type="submit" value="Submit"></input>
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
    </div>
  );
}
