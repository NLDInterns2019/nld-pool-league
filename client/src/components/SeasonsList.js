import React from "react";
import { Link } from "react-router-dom";

const SeasonsList = props => {
  const listToBeDisplayed = props.seasons.map(season => {
    return (
      <div>
        <Link
          to={{
            pathname: "/8-ball/overview",
            state: {
              activeSeason: season.DISTINCT
            }
          }}
        >
          Season {season.DISTINCT}
        </Link>
      </div>
    );
  });
  return (
    <div className="seasonsList">
      <h3>List of Seasons</h3>
      <ul>
        <li>{listToBeDisplayed}</li>
      </ul>
    </div>
  );
};

export default SeasonsList;
