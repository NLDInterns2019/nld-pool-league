import React from "react";
import {find, maxBy} from "lodash";

const itemsToBeDisplayed = props => {
  return (
    <tbody>
      <tr>
        <td>
          <span role="img" aria-label="boxing-glove">
          🥊
          </span>
        </td>
        <td>Undefeated</td>
        <td>{find(props.players, player => player.lose === 0).staffName}</td>
      </tr>
      <tr>
        <td>
          <span role="img" aria-label="balance-scale">
            ⚖️
          </span>
        </td>
        <td>Most draw</td>
        <td>{maxBy(props.players, "draw").staffName}</td>
      </tr>
      <tr>
        <td>
          <span role="img" aria-label="dizzy">
            😵
          </span>
        </td>
        <td>Loser</td>
        <td>{maxBy(props.players, "goalsAgainst").staffName}</td>
      </tr>
    </tbody>
  );
};

const FinalStat = props => {
  return (
    <div>
      <h3>Honorable Mentions</h3>
      <div className="leagueTableContainer">
        <table className="leagueTable" cellSpacing="0">
          <thead>
            <tr>
              <th />
              <th>Title</th>
              <th>Name</th>
            </tr>
          </thead>
          {itemsToBeDisplayed(props)}
        </table>
      </div>
    </div>
  );
};

export default FinalStat;
