"use client";

import React from "react";
import "app/styles/landingMain.css";
import { useAuth } from "../providers/Auth"; 

const Header = () => {
  const { isAuthenticated, handleLogin, handleLogout } = useAuth(); 

  return (
    <div className="body-container">
      <h1 className="title">Volunteer!</h1>
      <p className="body">Volunteer sign in page</p>
      {isAuthenticated ? (
        <button className="button" onClick={handleLogout}>Log Out</button>
      ) : (
        <button className="button" onClick={handleLogin}>Log In</button>
      )}
    </div>
  );
};

export default Header;
