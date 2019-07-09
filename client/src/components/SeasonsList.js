import React from "react";
import { Link } from "react-router-dom";

const SeasonsList = props => {
  const listToBeDisplayed = props.seasons.map(season => {
    return (
      <div key={season.seasonId}>
        <li>
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
            onClick={() => props.deleteSeason(season.seasonId)}
          >
            - Remove
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
