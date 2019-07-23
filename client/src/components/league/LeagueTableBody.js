import React from "react";

const LeagueTableBody = props => {
  const itemsToBeDisplayed = props.players.map((player, index) => {
    return (
      <tr
        onClick={() => {
          if (window.confirm(`Are you sure you want to delete ${player.staffName}?`))
            props.deletePlayer(player.staffName);
        }}
        key={player.seasonId + player.staffName}
      >
        <td align="center">{index + 1}</td>
        <td align="center" id="leagueTablePlayerName">
          {player.staffName}
        </td>
        <td align="center">{player.play}</td>
        <td align="center">{player.win}</td>
        <td align="center">{player.draw}</td>
        <td align="center">{player.lose}</td>
        <td align="center">{player.goalsFor}</td>
        <td align="center">{player.goalsAgainst}</td>
        <td align="center">{player.points}</td>
      </tr>
    );
  });
  return <tbody>{itemsToBeDisplayed}</tbody>;
};

export default LeagueTableBody;
