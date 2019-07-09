import React from "react";
import { Link } from "react-router-dom";

const removeSeason = toBeRemoved => {
  // remove the season
};

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
<<<<<<< HEAD
            onClick={removeSeason}
=======
            onClick={() => props.deleteSeason(season.seasonId)}
>>>>>>> b763dc0a1ad9d833303f5e69edd6449fa462d1a8
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
