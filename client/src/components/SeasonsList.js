import React from "react";
import { Link } from "react-router-dom";

const removeSeason = toBeRemoved => {
  // remove the season
};

const SeasonsList = props => {
  const listToBeDisplayed = props.seasons.map(season => {
    return (
      <div>
        <li key={season.seasonId}>
          <Link
            to={{
              pathname: "/8-ball/overview",
              state: {
                activeSeason: season.seasonId
              }
            }}
          >
            Season {season.seasonId}
          </Link>
          <button
            type="button"
            id={"remove" + season.seasonId}
            className="removeBtn"
            onClick={removeSeason}
          >
            - Remove Season
          </button>
        </li>
        <br />
      </div>
    );
  });

  return (
    <div className="seasonsList">
      <h3>List of Seasons</h3>
      <ul>{listToBeDisplayed}</ul>
    </div>
  );
};
export default SeasonsList;
