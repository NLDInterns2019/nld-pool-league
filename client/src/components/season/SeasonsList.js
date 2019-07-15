import React from "react";
import { Link } from "react-router-dom";

const SeasonsList = props => {
  const listToBeDisplayed = props.seasons.map(season => {
    return (
      <div key={season.seasonId}>
        <li>
          {props.type !== "Billiards" ? (
            <Link
              to={{
                pathname: `/${props.type}-ball/overview/${season.seasonId}`
              }}
            >
              Season {season.seasonId}
            </Link>
          ) : (
            <Link
              to={{
                pathname: `/${props.type}/overview/${season.seasonId}`
              }}
            >
              Season {season.seasonId}
            </Link>
          )}

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
