import React, { Component } from "react";
import "../../src/App.css";
import Navigator from "./Navigator.js";

const Header = () => {
  return (
    <div className="header">
      <div className="headerLeft">
        <h1>POOL MANAGER</h1>
      </div>
      <div className="headerRight">
        <Navigator current="8-Ball" items={["8-Ball", "9-Ball", "Billiards"]} />
      </div>
    </div>
  );
};

export default Header;
