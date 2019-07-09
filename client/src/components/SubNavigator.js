import React from "react";
import { Link, matchPath } from "react-router-dom";

const SubNavigator = () => {
  var currentPath = window.location.pathname;

  /* set the title of the nav bar depending on the URL path */
  var title = matchPath(currentPath, { path: "/8-ball", exact: false })
    ? "8-Ball"
    : matchPath(currentPath, { path: "/9-ball", exact: false })
    ? "9-Ball"
    : "Billiards";

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

  /* makes 'overview' link bold 
  var overviewCurrentStyle =
    matchPath(currentPath, { path: "overview", exact: false }) ||
    matchPath(currentPath, { path: "/8-ball", exact: true }) ||
    matchPath(currentPath, { path: "/9-ball", exact: true }) ||
    matchPath(currentPath, { path: "/billiards", exact: true })
      ? { fontWeight: "bold" }
      : {};
  */

  return (
    <div className="nav">
      <h2>{title}</h2>
      <ul>
        <li>
          <Link
            to={"/" + title.toLowerCase() + "/seasons"}
            style={seasonsCurrentStyle}
            id="seasonsLink"
          >
            Seasons
          </Link>
        </li>
        {/*<li>
          <Link
            to={"/" + title.toLowerCase() + "/overview"}
            style={overviewCurrentStyle}
            id="overviewLink"
          >
            Overview
          </Link>
        </li>*/}
        <li>
          <Link
            to={"/" + title.toLowerCase() + "/fixtures"}
            style={fixturesCurrentStyle}
            id="fixturesLink"
          >
            Fixtures
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SubNavigator;
