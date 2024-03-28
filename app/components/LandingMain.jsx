"use client";

import React from "react";
import "app/styles/landingMain.css";
import { useAuth } from "../providers/Auth"; 
import Header from "app/components/Header.jsx";
import Footer from "app/components/Footer.jsx";
const landingPage = () => {
  const { isAuthenticated, handleLogin, handleLogout } = useAuth(); 

  return (
    <div className="body-container">
      <Header/>
      <h1 className="title">Volunteer!</h1>
      <p className="body">Volunteer sign in page</p>
      {isAuthenticated ? (
        <button className="button" onClick={handleLogout}>Log Out</button>
      ) : (
        <button className="button" onClick={handleLogin}>Log In</button>
      )}
      <Footer/>
    </div>
  );
};

export default landingPage;
