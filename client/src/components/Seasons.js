import React from "react";
import SubNavBar from "./SubNavBar.js";
import Header from "./Header.js";
import "../App.css";

const Seasons = () => {
  return (
    <div className="seasons">
      <Header />
      <SubNavBar current="Seasons" />
      <div className="content">
        <ul>
          <li>Season 1</li>
          <li>Season 2</li>
        </ul>
        <button type="button">+ Add new season</button>
      </div>
    </div>
  );
};

export default Seasons;
