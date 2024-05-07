"use client";

import React from "react";
import "app/styles/landingMain.css";
import { useAuth } from "../providers/Auth";
import Header from "app/components/Header.jsx";
import Footer from "app/components/Footer.jsx";
const landingPage = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isAuthenticated, handleLogin, handleLogout } = useAuth(); 

  return (
    <div className="page-container">
      <Header />
      <div className="main-container">
        <div className="buttonAndText">
          {" "}
          <h1 className="title">Driving towards change</h1>
          <p className="body">Admin sign in page</p>
          {isAuthenticated ? (
            <>
            <button className="button" onClick={handleLogout}>
              Log Out
            </button>
            <a href="/dashboardEmployee">
            <button className="button" style={{ marginTop: '10px' }}>
              Go Dashboard
            </button>
            </a>
            </>
          ) : (
            <button className="button" onClick={handleLogin}>
              Log In
            </button>
          )}
        </div>

        <img
          className="carImage"
          src="/images/croppedCarImage.png"
          alt="Image of car with location icon"
        />
      </div>
      {/* */}
      <div className="footer-space">
        <Footer />
      </div>
    </div>
  );
};

export default landingPage;
