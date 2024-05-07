"use client";
import { useState } from "react";
import "app/styles/dashHeader.css";

export default function DashHeader() {
  const [display, setDisplay] = useState(false);
  return (
    <div>
      <div className="header-component">
        <div className="logo-component">
          <a href="/">
            <p className="header-text">WCOA</p>
          </a>
        </div>
        <div className="profile-circle">
          <input
            type="image"
            className="profile-placeholder"
            src="/images/profileImagePlaceHolder.png"
            alt="profile image"
            onClick={() => setDisplay((prevDisplay) => !prevDisplay)}
          />
        </div>
      </div>
      <div
        className="logout-popup"
        style={{ display: display ? "block" : "none" }}
      >
        <div className="popup-content">
          <p>Logout</p>
          <button
            type="button"
            className="changeAccountButton"
            onClick={() => setDisplay((prevDisplay) => !prevDisplay)}
          >
            Change Account
          </button>
          <button
            type="button"
            className="logoutButton"
            onClick={() => setDisplay((prevDisplay) => !prevDisplay)}
          >
            Sign Out
          </button>
        </div>
        <button
          type="button"
          className="cancelButton"
          onClick={() => setDisplay((prevDisplay) => !prevDisplay)}
        >
          <span className="material-symbols-rounded">close</span>
        </button>
      </div>
    </div>
  );
}
