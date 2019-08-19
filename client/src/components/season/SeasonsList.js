import React from "react";
import { Link } from "react-router-dom";
import auth0Client from "../../Auth";

const SeasonsList = props => {
  const listToBeDisplayed = props.seasons.map(season => {
    return (
      <div key={season.seasonId}>
        <li>
          {season.finished ? (
            <Link
              to={{
                pathname: `/${props.type}-ball/overview/${season.seasonId}`
              }}
            >
              <div className="seasons-list-item">
                <p>Season {season.seasonId}</p>
                <div className="chequered-flag-icon-36" alt="chequered flag" />
              </div>
            </Link>
          ) : season.playoff ? (
            <Link
              to={{
                pathname: `/${props.type}-ball/overview/${season.seasonId}`
              }}
            >
              <div className="seasons-list-item">
                <p>Season {season.seasonId}</p>
                <div className="playoff-icon" alt="playoff" />
              </div>
            </Link>
          ) : (
            <Link
              to={{
                pathname: `/${props.type}-ball/overview/${season.seasonId}`
              }}
            >
              Season {season.seasonId}
            </Link>
          )}
          {auth0Client.isAuthenticated() &&
          auth0Client.getProfile().nickname === "admin" ? (
            <div
              id={"remove" + season.seasonId}
              className="delete-icon"
              alt="delete season"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this season?")
                )
                  props.deleteSeason(season.seasonId);
              }}
            />
          ) : null}
        </li>
        <br />
      </div>
    );
  });

  return (
    <div id="seasonsList">
      <h3>{props.type}-ball Seasons</h3>
      <ul>{listToBeDisplayed}</ul>
    </div>
  );
};
export default SeasonsList;
