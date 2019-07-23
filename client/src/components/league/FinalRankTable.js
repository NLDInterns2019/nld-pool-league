import React from "react";

const itemsToBeDisplayed = props => {
  return (
    <tbody>
      <tr>
        <td>
          <span role="img" aria-label="first">
            🥇
          </span>
        </td>
        <td>{props.players[0].staffName}</td>
        <td>{props.players[0].points}</td>
      </tr>
      <tr>
        <td>
          <span role="img" aria-label="second">
            🥈
          </span>
        </td>
        <td>{props.players[1].staffName}</td>
        <td>{props.players[1].points}</td>
      </tr>
      {props.players.length >= 3 ? (
        <tr>
          <td>
            <span role="img" aria-label="third">
              🥉
            </span>
          </td>
          <td>{props.players[2].staffName}</td>
          <td>{props.players[2].points}</td>
        </tr>
      ) : null}
    </tbody>
  );
};

const FinalRankTable = props => {
  return (
    <div>
      <h3>{"Season " + props.activeSeason} Winners</h3>
      <div className="leagueTableContainer">
        <table className="leagueTable" cellSpacing="0">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Pts</th>
            </tr>
          </thead>
          {itemsToBeDisplayed(props)}
        </table>
      </div>
    </div>
  );
};

export default FinalRankTable;
