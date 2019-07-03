import React from "react";
import { Link, matchPath } from "react-router-dom";

const SubNavigator = props => {
  var currentPath = window.location.pathname;

  /* makes 'seasons' link bold */
  var seasonsCurrentStyle = matchPath(currentPath, {
    path: "*/seasons",
    exact: false
  })
    ? {
        fontWeight: "bold"
      }
    : {};

  /* makes 'fixtures' link bold */
  var fixturesCurrentStyle = matchPath(currentPath, {
    path: "*/fixtures",
    exact: false
  })
    ? {
        fontWeight: "bold"
      }
    : {};

  /* makes 'overview' link bold */
  var overviewCurrentStyle =
    matchPath(currentPath, { path: "*/overview", exact: false }) ||
    matchPath(currentPath, { path: "/8-ball", exact: true }) ||
    matchPath(currentPath, { path: "/9-ball", exact: true }) ||
    matchPath(currentPath, { path: "/billiards", exact: true })
      ? { fontWeight: "bold" }
      : {};

  return (
    <div className="nav">
      <h2>{props.title}</h2>
      <ul>
        <li>
          <Link
            to={"/" + props.title.toLowerCase() + "/seasons"}
            style={seasonsCurrentStyle}
          >
            Seasons
          </Link>
        </li>
        <li>
          <Link
            to={"/" + props.title.toLowerCase() + "/overview"}
            style={overviewCurrentStyle}
          >
            Overview
          </Link>
        </li>
        <li>
          <Link
            to={"/" + props.title.toLowerCase() + "/fixtures"}
            style={fixturesCurrentStyle}
          >
            Fixtures
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SubNavigator;
