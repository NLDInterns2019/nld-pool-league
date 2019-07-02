import React from "react";
import { Link } from "react-router-dom";

const SeasonsList = () => {
  return (
    <div className="seasonsList">
      <h3>List of Seasons</h3>
      <ul>
        <li>
          <Link to="/8-ball/overview">Season 1</Link>
          <Link to="/8-ball/overview">Season 2</Link>
        </li>
      </ul>
    </div>
  );
};

export default SeasonsList;
