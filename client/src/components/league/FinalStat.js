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

const FinalStat = props => {
  return <div>Final Stat</div>;
};

export default FinalStat;
