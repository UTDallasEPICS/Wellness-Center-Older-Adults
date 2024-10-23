import React from "react";
import NavLinks from "./nav-links"; 
import "../../styles/sideNav.css"; 

const SideNav = ({ toggleCollapse, isCollapsed }) => {
  return (
    <div className={`sidenav ${isCollapsed ? "collapsed" : ""}`}>
      <button className="toggle-btn" onClick={toggleCollapse}>
        <div className="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
        {!isCollapsed && <span className="collapse-text">Collapse</span>}
      </button>
      <NavLinks isCollapsed={isCollapsed} />
    </div>
  );
};

export default SideNav;

