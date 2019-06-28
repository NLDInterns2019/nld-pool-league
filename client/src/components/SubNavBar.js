import React from "react";
import "../App.css";
import Navigator from "./Navigator.js";

const SubNavBar = () => {
  return (
    <div className="subnav">
      <Navigator
        current="Overview"
        title="8-Ball"
        items={["Seasons", "Overview", "Fixtures"]}
      />
    </div>
  );
};

export default SubNavBar;
