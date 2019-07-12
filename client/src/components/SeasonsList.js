import React from "react";
import { Link } from "react-router-dom";
import DeleteButton from "../delete-button.svg";

const SeasonsList = props => {
  const listToBeDisplayed = props.seasons.map(season => {
    return (
      <div key={season.seasonId}>
        <li>
          <Link
            to={{
              pathname: `/${props.type}-ball/overview`,
              state: {
                type: props.type,
                activeSeason: season.seasonId
              }
            }}
          >
            Season {season.seasonId}
          </Link>
          <div
            // src={DeleteButton}
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
    <div className="seasonsList">
      <h3>{props.type}-ball Seasons</h3>
      <ul>{listToBeDisplayed}</ul>
    </div>
  );
};
export default SeasonsList;
