import React from "react";

const TableBody = props => {
  const itemsToBeDisplayed = props.players.map(player => {
    return (
      <tr key={player.staffName}>
        <td align="center">0</td>
        <td align="center">{player.staffName}</td>
        <td align="center">{player.played}</td>
        <td align="center">{player.win}</td>
        <td align="center">{player.draw}</td>
        <td align="center">{player.lost}</td>
        <td align="center">{player.goalsFor}</td>
        <td align="center">{player.goalsAgainst}</td>
        <td align="center">{player.points}</td>
      </tr>
    );
  });
  return <tbody>{itemsToBeDisplayed}</tbody>;
};

export default TableBody;
