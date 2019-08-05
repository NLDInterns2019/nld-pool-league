import React from "react";

/* placeholder array to show how a players results could be stored */
const results = [
  "W", // oldest
  "W",
  "D",
  "L",
  "L",
  "W",
  "D",
  "W",
  "W",
  "W",
  "L",
  "D",
  "W"
];

/* takes an array of results and returns icons for the last five */
const getPlayerForm = results => {
  var formToDisplay = [];
  /* if the player hasn't played any games */
  if (results.length === 0) {
    formToDisplay = " - ";
    /* if the player has played less than 5 games */
  } else if (results.length < 5) {
    /* go from the most recent game to the oldest */
    for (var i = results.length - 1; i >= 0; i--) {
      /* if the player won, add a win icon */
      if (results[i] === "W") {
        formToDisplay = formToDisplay.concat(
          <div className="leagueTableFormItem">
            <div className="win-icon" alt="win" />
          </div>
        );
        /* if the player drew, add a draw icon */
      } else if (results[i] === "D") {
        formToDisplay = formToDisplay.concat(
          <div className="leagueTableFormItem">
            <div className="draw-icon" alt="draw" />
          </div>
        );
        /* if the player lost, add a loss icon */
      } else if (results[i] === "L") {
        formToDisplay = formToDisplay.concat(
          <div className="leagueTableFormItem">
            <div className="loss-icon" alt="loss" />
          </div>
        );
        /* otherwise, display an error */
      } else {
        formToDisplay = formToDisplay.concat("ERROR");
      }
    }
    /* if the player has played 5 or more games */
  } else {
    /* go from the most recent game to the 5th most recent */
    for (var j = results.length - 1; j > results.length - 6; j--) {
      /* if the player won, add a win icon */
      if (results[j] === "W") {
        formToDisplay = formToDisplay.concat(
          <div className="leagueTableFormItem">
            <div className="win-icon" alt="win" />
          </div>
        );
        /* if the player drew, add a draw icon */
      } else if (results[j] === "D") {
        formToDisplay = formToDisplay.concat(
          <div className="leagueTableFormItem">
            <div className="draw-icon" alt="draw" />
          </div>
        );
        /* if the player lost, add a loss icon */
      } else if (results[j] === "L") {
        formToDisplay = formToDisplay.concat(
          <div className="leagueTableFormItem">
            <div className="loss-icon" alt="loss" />
          </div>
        );
        /* otherwise, display an error */
      } else {
        formToDisplay = formToDisplay.concat("ERROR");
      }
    }
  }
  return formToDisplay;
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
        {/* <td align="center" className="leagueTableForm"> */}
        {/* store all the players results in an array and call it like this? */}
        {/* {getPlayerForm(player.results)} */}
        {/* placeholder array being sent for now */}
        {/* {getPlayerForm(results)} */}
        {/* </td> */}
        <td align="center">{player.points}</td>
        {player.paid ? (
          <td align="center">Yes</td>
        ) : (
          <td
            align="center"
            onClick={() => {
              if (window.confirm(`Are you sure ${player.staffName} has paid?`))
                props.feePaid(player.staffName);
            }}
          >
            No
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
