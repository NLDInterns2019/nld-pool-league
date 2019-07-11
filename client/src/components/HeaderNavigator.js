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
          <Link
            to={{
              pathname: "/8-ball/seasons",
              state: {
                type: 8
              }
            }}
            style={eightBallCurrentStyle}
            id="eightBallLink"
          >
            8-Ball
          </Link>
        </li>
        <li>
          <Link
            to={{
              pathname: "/9-ball/seasons",
              state: {
                type: 9
              }
            }}
            style={nineBallCurrentStyle}
            id="nineBallLink"
          >
            9-Ball
          </Link>
        </li>
        <li>
          <Link
            to={{
              pathname: "/billiards/seasons",
              state: {}
            }}
            style={billiardsCurrentStyle}
            id="billiardsLink"
          >
            Billiards
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default HeaderNavigator;
