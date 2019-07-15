import React from "react";
import "../App.css";
import SubNavigator from "./SubNavigator.js";

const SubNavBar = (props) => {
  return (
    <div className="subnav">
      <SubNavigator type={props.type} />
    </div>
  );
};

export default SubNavBar;
