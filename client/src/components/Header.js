import React from "react";
import "../App.css";
import HeaderNavigator from "./HeaderNavigator.js";
import { Link, matchPath } from "react-router-dom";

const Header = () => {
  var currentPath = window.location.pathname;
  return (
    <div className="header" id="headerBox">
      <div className="headerLeft">
        <Link to="/">POOL MANAGER</Link>
      </div>
      <div className="headerRight">
        {matchPath(currentPath, { path: "/", exact: true }) ? (
          <div />
        ) : (
          <HeaderNavigator />
        )}
      </div>
    </div>
  );
};

export default Header;
