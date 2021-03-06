import React from "react";
import { Link, matchPath, withRouter } from "react-router-dom";

const HeaderNavigator = () => {
  var currentPath = window.location.pathname;
  /* makes '8-ball' bold */
  var eightBallCurrentStyle = matchPath(currentPath, {
    path: "/8-ball",
    exact: false
  })
    ? { opacity: 1 }
    : {};

  /* makes '9-ball' bold */
  var nineBallCurrentStyle = matchPath(currentPath, {
    path: "/9-ball",
    exact: false
  })
    ? { opacity: 1 }
    : {};

  /* makes 'billiards' bold */
  // var billiardsCurrentStyle = matchPath(currentPath, {
  //   path: "/billiards",
  //   exact: false
  // })
  //   ? { opacity: 1 }
  //   : {};

  return (
    <div className="nav">
      <ul>
        <li>
          <Link
            to="/8-ball/seasons"
            style={eightBallCurrentStyle}
            id="eightBallLink"
          >
            8-Ball
          </Link>
        </li>
        <li>
          <Link
            to="/9-ball/seasons"
            style={nineBallCurrentStyle}
            id="nineBallLink"
          >
            9-Ball
          </Link>
        </li>
        {/* <li>
          <Link
            to="/billiards/seasons"
            style={billiardsCurrentStyle}
            id="billiardsLink"
          >
            Billiards
          </Link>
        </li> */}
      </ul>
    </div>
  );
};

export default withRouter(HeaderNavigator);
