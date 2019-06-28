import React from "react";
import "../App.css";
import Navigator from "./Navigator.js";

const SubNavBar = props => {
  return (
    <div className="subnav">
      <Navigator
        current={props.current}
        title="8-Ball"
        items={["Seasons", "Overview", "Fixtures"]}
      />
    </div>
  );
};

export default SubNavBar;
