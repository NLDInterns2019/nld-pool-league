import React from "react";

const itemsToBeDisplayed = props => {
  return (
    <tbody>
      <tr>
        <td align="center" className="rank">
          <div className="gold-medal-icon" alt="first place" />
        </td>
        <td>{props.players[0].staffName}</td>
        <td>{props.players[0].points}</td>
      </tr>
      <tr>
        <td align="center" className="rank">
          <div className="silver-medal-icon" alt="second place" />
        </td>
        <td>{props.players[1].staffName}</td>
        <td>{props.players[1].points}</td>
      </tr>
      {props.players.length >= 3 ? (
        <tr>
          <td align="center" className="rank">
            <div className="bronze-medal-icon" alt="third place" />
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
      <div className="seasonWinnersTitleContainer">
        <span className="trophy-icon-large" alt="trophy" />
        <h3>{"Season " + props.activeSeason} Winners</h3>
        <span className="trophy-icon-large" alt="trophy" />
      </div>
      <div className="seasonWinnersTableContainer">
        <table
          className="seasonWinnersTable"
          style={{ width: "500px" }}
          cellSpacing="0"
        >
          <thead>
            <tr>
              <th className="rank">Rank</th>
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
