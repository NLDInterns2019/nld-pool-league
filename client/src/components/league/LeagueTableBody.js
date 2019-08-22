import React from "react";
import auth0Client from "../../Auth";
import Forms from "./Forms";

const LeagueTableBody = props => {
  const itemsToBeDisplayed = props.players.map((player, index) => {
    return (
      <tr key={player.seasonId + player.staffName}>
        <td align="center">
          {index === 0
            ? index + 1
            : props.players[index - 1].points !== 0 &&
              props.players[index - 1].points === props.players[index].points &&
              props.players[index - 1].goalsFor ===
                props.players[index].goalsFor &&
              props.players[index - 1].goalsAgainst ===
                props.players[index].goalsAgainst
            ? index
            : index + 1}
        </td>
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
