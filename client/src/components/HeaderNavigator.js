import React from "react";
import { Link, matchPath } from "react-router-dom";

const HeaderNavigator = () => {
  var currentPath = window.location.pathname;
  /* makes '8-ball' bold */
  var eightBallCurrentStyle = matchPath(currentPath, {
    path: "/8-ball",
    exact: false
  })
    ? { fontWeight: "bold" }
    : {};

  /* makes '9-ball' bold */
  var nineBallCurrentStyle = matchPath(currentPath, {
    path: "/9-ball",
    exact: false
  })
    ? { fontWeight: "bold" }
    : {};

  /* makes 'billiards' bold */
  var billiardsCurrentStyle = matchPath(currentPath, {
    path: "/billiards",
    exact: false
  })
    ? { fontWeight: "bold" }
    : {};

  return (
    <div className="nav">
      <ul>
        <li>
          <Link to="/8-ball/seasons" style={eightBallCurrentStyle}>
            8-Ball
          </Link>
        </li>
        <li>
          <Link to="/9-ball/seasons" style={nineBallCurrentStyle}>
            9-Ball
          </Link>
        </li>
        <li>
          <Link to="/billiards/seasons" style={billiardsCurrentStyle}>
            Billiards
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default HeaderNavigator;
