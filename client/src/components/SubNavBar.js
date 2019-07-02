import React from "react";
import "../App.css";
import SubNavigator from "./SubNavigator.js";

const SubNavBar = props => {
  return (
    <div className="subnav">
      <SubNavigator title="8-Ball" />
    </div>
  );
};

export default SubNavBar;
