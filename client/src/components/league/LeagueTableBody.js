import React from "react";

/* takes an array of results and returns icons for the last five */
const getPlayerForm = forms => {
  let formsToBeDisplayed = [];
  for (let i = 0; i < forms.length; i++) {
    if (forms.charAt(i) === "W") {
      formsToBeDisplayed = formsToBeDisplayed.concat(
        <div className="leagueTableFormItem">
          <div className="win-icon" alt="win" />
        </div>
      );
    }
    if (forms.charAt(i) === "D") {
      formsToBeDisplayed = formsToBeDisplayed.concat(
        <div className="leagueTableFormItem">
          <div className="draw-icon" alt="draw" />
        </div>
      );
    }
    if (forms.charAt(i) === "L") {
      formsToBeDisplayed = formsToBeDisplayed.concat(
        <div className="leagueTableFormItem">
          <div className="loss-icon" alt="loss" />
        </div>
      );
    }
    if (forms.charAt(i) === "-") {
      formsToBeDisplayed = formsToBeDisplayed.concat(
        <div className="leagueTableFormItem">
          -
        </div>
      );
    }
  }
  return formsToBeDisplayed;
};

const LeagueTableBody = props => {
  const itemsToBeDisplayed = props.players.map((player, index) => {
    return (
      <tr key={player.seasonId + player.staffName}>
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
        <td align="center" className="leagueTableForm">
          {getPlayerForm(player.form)}
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
      </tr>
    );
  });
  return <tbody>{itemsToBeDisplayed}</tbody>;
};

export default LeagueTableBody;
