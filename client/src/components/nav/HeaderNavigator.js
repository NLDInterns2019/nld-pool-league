import React from "react";
import { Link, matchPath, withRouter } from "react-router-dom";
import auth0Client from "../../Auth";

const HeaderNavigator = props => {
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
        <li>
          <Link
            to="/billiards/seasons"
            style={billiardsCurrentStyle}
            id="billiardsLink"
          >
            Billiards
          </Link>
        </li>
        <li>
          <Link>
            {!auth0Client.isAuthenticated() && (
              <button className="btn btn-dark" onClick={auth0Client.signIn}>
                Sign In
              </button>
            )}
            {auth0Client.isAuthenticated() && (
              <div>
                <button
                  className="btn btn-dark"
                  onClick={() => {
                    props.signOut();
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default withRouter(HeaderNavigator);
