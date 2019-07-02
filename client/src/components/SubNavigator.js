import React from "react";
import { Link } from "react-router-dom";

const SubNavigator = props => {
  return (
    <div className="nav">
      <h2>{props.title}</h2>
      <ul>
        <li>
          <Link to={"/" + props.title.toLowerCase() + "/seasons"}>Seasons</Link>
        </li>
        <li>
          <Link to={"/" + props.title.toLowerCase() + "/overview"}>
            Overview
          </Link>
        </li>
        <li>
          <Link to={"/" + props.title.toLowerCase() + "/fixtures"}>
            Fixtures
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SubNavigator;
