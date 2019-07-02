import React from "react";
import "../App.css";
import HeaderNavigator from "./HeaderNavigator.js";

const Header = () => {
  return (
    <div className="header">
      <div className="headerLeft">
        <h1>POOL MANAGER</h1>
      </div>
      <div className="headerRight">
        <HeaderNavigator current="8-Ball" />
      </div>
    </div>
  );
};

export default Header;
