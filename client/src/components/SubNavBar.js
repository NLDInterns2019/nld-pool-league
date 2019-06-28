import React, { Component } from "react";
import "../../src/App.css";
import Navigator from "./Navigator.js";

class SubNavBar extends Component {
  render() {
    return (
      <div className="subnav">
        <Navigator
          current="Overview"
          title="8-Ball"
          items={["Seasons", "Overview", "Fixtures"]}
        />
      </div>
    );
  }
}

export default SubNavBar;
