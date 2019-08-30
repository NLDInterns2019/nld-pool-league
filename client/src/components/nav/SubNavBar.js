import React from "react";
import Collapsible from "./Collapsible.js";
import { Link, matchPath } from "react-router-dom";
import auth0Client from "../../Auth";

const SubNavBar = props => {
  var currentPath = window.location.pathname;

  var icon = matchPath(currentPath, { path: "/8-ball", exact: false }) ? (
    <div className="eight-ball-icon icon-40" alt="eight ball" />
  ) : matchPath(currentPath, { path: "/9-ball", exact: false }) ? (
    <div className="nine-ball-icon icon-40" alt="nine ball" />
  ) : (
    "TYPE ERROR"
  );

  /* set the title of the nav bar depending on the URL path */
  var title =
    matchPath(currentPath, { path: "/8-ball/seasons", exact: false }) ||
    matchPath(currentPath, { path: "/8-ball/hall_of_fame", exact: false }) ||
    matchPath(currentPath, { path: "/8-ball/kitty", exact: false }) ||
    matchPath(currentPath, { path: "/8-ball/dashboard", exact: false })
      ? "8-Ball"
      : matchPath(currentPath, { path: "/8-ball/overview" }) ||
        matchPath(currentPath, { path: "/8-ball/fixtures" })
      ? "8-Ball Season " + props.activeSeason
      : matchPath(currentPath, { path: "/9-ball/seasons", exact: false }) ||
        matchPath(currentPath, {
          path: "/9-ball/hall_of_fame",
          exact: false
        }) ||
        matchPath(currentPath, { path: "/9-ball/kitty", exact: false }) ||
        matchPath(currentPath, { path: "/9-ball/dashboard", exact: false })
      ? "9-Ball"
      : matchPath(currentPath, { path: "/9-ball/overview" }) ||
        matchPath(currentPath, { path: "/9-ball/fixtures" })
      ? "9-Ball Season " + props.activeSeason
      : "Billiards";

  /* makes 'All Seasons' link bold */
  var seasonsCurrentStyle = matchPath(currentPath, {
    path: "*/seasons",
    exact: false
  })
    ? {
        opacity: 1
      }
    : {};

  /* makes 'fixtures' link bold */
  var fixturesCurrentStyle = matchPath(currentPath, {
    path: "*/fixtures",
    exact: false
  })
    ? {
        opacity: 1
      }
    : {};

  /* makes 'current season' link bold */
  var currentSeasonCurrentStyle = matchPath(currentPath, {
    path: "*/overview",
    exact: false
  })
    ? {
        opacity: 1
      }
    : {};

  /* makes 'hall of fame' link bold */
  var hallOfFameCurrentStyle = matchPath(currentPath, {
    path: "*/hall_of_fame",
    exact: false
  })
    ? {
        opacity: 1
      }
    : {};

  /* makes 'dashboard' link bold */
  var dashboardCurrentStyle = matchPath(currentPath, {
    path: "*/dashboard",
    exact: false
  })
    ? {
        opacity: 1
      }
    : {};

  /* makes 'kitty' link bold */
  var kittyCurrentStyle = matchPath(currentPath, {
    path: "*/kitty",
    exact: false
  })
    ? {
        opacity: 1
      }
    : {};

  const seasonFixtureLink = path => {
    if (props.type !== "Billiards") {
      if (props.activeSeason === undefined) {
        if (props.latestSeason === null) {
          return (
            <span>
              <li>
                <Link
                  to={`/${path}/hall_of_fame`}
                  style={hallOfFameCurrentStyle}
                  id="HoFLink"
                >
                  Hall of Fame
                </Link>
              </li>
              <li>
                <Link
                  to={`/${path}/kitty`}
                  style={kittyCurrentStyle}
                  id="KittyLink"
                >
                  Kitty
                </Link>
              </li>
            </span>
          );
        } else {
          //LATEST SEASON EXIST
          return (
            <span>
              <li>
                <Link
                  to={`/${path}/overview/${props.latestSeason}`}
                  style={currentSeasonCurrentStyle}
                  id="currentSeasonLink"
                >
                  Current Season
                </Link>
              </li>
              <li>
                <Link
                  to={`/${path}/fixtures/${props.latestSeason}`}
                  style={fixturesCurrentStyle}
                  id="fixturesLink"
                >
                  Arrange Fixtures
                </Link>
              </li>
              <li>
                <Link
                  to={`/${path}/hall_of_fame`}
                  style={hallOfFameCurrentStyle}
                  id="HoFLink"
                >
                  Hall of Fame
                </Link>
              </li>
              <li>
                <Link
                  to={`/${path}/kitty`}
                  style={kittyCurrentStyle}
                  id="KittyLink"
                >
                  Kitty
                </Link>
              </li>
            </span>
          );
        }
      } else {
        //ACTIVE SEASON
        return (
          <span>
            <li>
              <Link
                to={`/${path}/overview/${props.activeSeason}`}
                style={currentSeasonCurrentStyle}
                id="currentSeasonLink"
              >
                Current Season
              </Link>
            </li>
            <li>
              <Link
                to={`/${path}/fixtures/${props.activeSeason}`}
                style={fixturesCurrentStyle}
                id="fixturesLink"
              >
                Arrange Fixtures
              </Link>
            </li>
            <li>
              <Link
                to={`/${path}/hall_of_fame`}
                style={hallOfFameCurrentStyle}
                id="HoFLink"
              >
                Hall of Fame
              </Link>
            </li>
            <li>
              <Link
                to={`/${path}/kitty`}
                style={kittyCurrentStyle}
                id="KittyLink"
              >
                Kitty
              </Link>
            </li>
          </span>
        );
      }
    }
  };

  return (
    <div className="subnav-container">
      <div className="subnav">
        {icon}
        <div className="nav">
          <h2
            style={{
              width: "250px",
              marginRight: "1.5rem"
            }}
          >
            {title}
          </h2>
          <ul className="main-items">
            <li>
              <Link
                to={`/${props.type}-ball/seasons`}
                style={seasonsCurrentStyle}
                id="seasonsLink"
              >
                All Seasons
              </Link>
            </li>
            {seasonFixtureLink(`${props.type}-ball`)}
            <li>
              {auth0Client.isAuthenticated() &&
              auth0Client.getProfile().nickname !== "admin" ? (
                <Link
                  to={`/${props.type}-ball/dashboard`}
                  style={dashboardCurrentStyle}
                  id="dashboardLink"
                >
                  My Dashboard
                </Link>
              ) : null}
            </li>
          </ul>
        </div>
        <Collapsible
          type={props.type}
          seasonFixtureLink={seasonFixtureLink}
          seasonsCurrentStyle={seasonsCurrentStyle}
          dashboardCurrentStyle={dashboardCurrentStyle}
        />
      </div>
      <div className="subnav-fade" />
    </div>
  );
};

export default SubNavBar;
