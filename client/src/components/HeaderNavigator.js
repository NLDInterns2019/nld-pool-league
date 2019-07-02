import React from "react";
import { Link } from "react-router-dom";

const HeaderNavigator = props => {
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
