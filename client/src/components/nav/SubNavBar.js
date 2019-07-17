import React from "react";
import { Link, matchPath } from "react-router-dom";

const SubNavBar = props => {
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
  return (
    <div className="subnav">
      <div className="nav">
        <h2>{title}</h2>
        <ul>
          <li>
            {title !== "Billiards" ? (
              <Link
                to={`/${props.type}-ball/seasons`}
                style={seasonsCurrentStyle}
                id="seasonsLink"
              >
                Seasons
              </Link>
            ) : (
              <Link
                to={`/${props.type}/seasons`}
                style={seasonsCurrentStyle}
                id="seasonsLink"
              >
                Seasons
              </Link>
            )}
          </li>
          <li>
            {title !== "Billiards" ? (
              <Link
                to={`/${props.type}-ball/fixtures`}
                style={fixturesCurrentStyle}
                id="fixturesLink"
              >
                Arrange Fixtures
              </Link>
            ) : (
              <Link
                to={`/${props.type}/fixtures`}
                style={fixturesCurrentStyle}
                id="fixturesLink"
              >
                Arrange Fixtures
              </Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SubNavBar;
