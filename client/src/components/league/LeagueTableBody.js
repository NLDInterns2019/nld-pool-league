import React from "react";
import auth0Client from "../../Auth";
import Forms from "./Forms";

const LeagueTableBody = props => {
  const itemsToBeDisplayed = props.players.map((player, index) => {
    return (
      <tr key={player.seasonId + player.staffName}>
        <td align="center">{index + 1}</td>
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
          <td
            className="leagueTablePaymentCol"
            id="hasNotPaid"
            align="center"
            onClick={() => {
              if (window.confirm(`Are you sure ${player.staffName} has paid?`))
                props.feePaid(player.staffName);
            }}
          >
            <div id="pay-overlay">Pay</div>
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
