import React, { Component } from "react";
import "../../src/App.css";
import HeaderNav from "./HeaderNav.js";

class Header extends Component {
  render() {
    return (
      <div className="header">
        <h1>POOL MANAGER</h1>
        <HeaderNav />
      </div>
    );
  }
}

export default Header;
