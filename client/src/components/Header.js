import React from "react";
import "../App.css";
import HeaderNavigator from "./HeaderNavigator.js";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header" id="headerBox">
      <div className="headerLeft">
        <Link to="/">POOL MANAGER</Link>
      </div>
      <div className="headerRight">
        {window.location.pathname !== "/" ? (
          <HeaderNavigator current="8-Ball" />
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default Header;
