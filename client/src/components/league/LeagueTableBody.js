import React from "react";
import auth0Client from "../../Auth";
import Forms from "./Forms";

const LeagueTableBody = props => {
  const position = (players, player, index) => {
    if (index === 0) {
      return index + 1;
    }

    let finalIndex = index - 1;

    while (
      finalIndex >= 0 &&
      players[finalIndex].points !== 0 &&
      players[finalIndex].points === player.points &&
      players[finalIndex].goalsFor === player.goalsFor &&
      players[finalIndex].goalsAgainst === player.goalsAgainst
    ) {
      finalIndex--;
    }

    return finalIndex + 2;
  };

  const itemsToBeDisplayed = props.players.map((player, index) => {
    return (
      <tr key={player.seasonId + player.staffName}>
        <td align="center">{position(props.players, player, index)}</td>
        <td align="center" id="leagueTablePlayerName">
          {player.staffName}
        </td>
        <td align="center">{player.play}</td>
        <td align="center" className="leagueTableWin">
          {player.win}
        </td>
        <td align="center" className="leagueTableDraw">
          {player.draw}
        </td>
        <td align="center" className="leagueTableLose">
          {player.lose}
        </td>
        <td align="center" className="leagueTableFor">
          {player.goalsFor}
        </td>
        <td align="center" className="leagueTableAgainst">
          {player.goalsAgainst}
        </td>
        <td align="center" className="leagueTableForm">
          <Forms form={player.form} />
        </td>
        <td align="center">{player.points}</td>
        {player.paid ? (
          <td className="leagueTablePaymentCol" id="hasPaid" align="center">
            <div className="tick-icon" alt="tick" />
          </td>
        ) : (
          <td className="leagueTablePaymentCol" id="hasNotPaid" align="center">
            <div className="cross-icon" alt="cross" />
          </td>
        )}
        {auth0Client.isAuthenticated() &&
        auth0Client.getProfile().nickname === "admin" &&
        !props.hasFinished ? (
          <td style={{ backgroundColor: "#DBE9E2" }}>
            <span
              className="delete-icon"
              id={"delete-" + player.staffName}
              onClick={() => {
                if (
                  window.confirm(
                    `Are you sure you want to delete ${player.staffName}?`
                  )
                )
                  props.deletePlayer(player.staffName);
              }}
              alt="remove player"
            />
          </td>
        ) : null}
      </tr>
    );
  });
  return <tbody>{itemsToBeDisplayed}</tbody>;
};

export default LeagueTableBody;
