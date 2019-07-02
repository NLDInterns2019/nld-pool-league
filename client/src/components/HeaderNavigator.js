import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SeasonsPage from "./SeasonsPage";
import FixturesPage from "./FixturesPage";
import App from "./App.js";

const HeaderNavigator = props => {
  var current = props.current;

  return (
    <div className="nav">
      <ul>
        <li>
          <Link to="/8-ball">8-Ball</Link>
        </li>
        <li>
          <Link to="/9-ball">9-Ball</Link>
        </li>
        <li>
          <Link to="/billiards">Billiards</Link>
        </li>
      </ul>
    </div>
  );
};

export default HeaderNavigator;
