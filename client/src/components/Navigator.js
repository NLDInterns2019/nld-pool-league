import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SeasonsPage from "./SeasonsPage";
import FixturesPage from "./FixturesPage";
import App from "./App.js";

const Navigator = props => {
  var currentStyle = {
    fontWeight: "bold"
  };

  var current = props.current;
  const itemsToBeDisplayed = props.items.map(item =>
    current === item ? (
      <li key={item}>
        <Link to={"/" + { item }} style={currentStyle}>
          {item}
        </Link>
      </li>
    ) : (
      <li key={item}>
        <Link to={"/" + { item }}>{item}</Link>
      </li>
    )
  );

  return (
    <div className="nav">
      <h2>{props.title}</h2>
      <ul>{itemsToBeDisplayed}</ul>
    </div>
  );
};

export default Navigator;
