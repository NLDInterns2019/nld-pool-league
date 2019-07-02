import React from "react";
import { Link } from "react-router-dom";

const SeasonsList = () => {
  return (
    <div className="seasonsList">
      <ul>
        <li>
          <Link to="/8-ball/overview">Season 1</Link>
        </li>
      </ul>
    </div>
  );
};

export default SeasonsList;
