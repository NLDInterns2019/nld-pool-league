import React from "react";
import { Link } from "react-router-dom";

const SeasonsList = props => {
  const listToBeDisplayed = props.seasons.map(season => {
    return (
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
      </li>
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
