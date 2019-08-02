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

const getForm = results => {
  var formToDisplay = [];
  if (results.length === 0) {
    formToDisplay = " - ";
  } else if (results.length < 5) {
    /* go from the most recent game to the oldest */
    for (var i = results.length - 1; i >= 0; i--) {
      if (results[i] === "W") {
        formToDisplay = formToDisplay.concat(
          <div className="leagueTableFormItem">
            <div className="win-icon" alt="win" />
          </div>
        );
      } else if (results[i] === "D") {
        formToDisplay = formToDisplay.concat(
          <div className="leagueTableFormItem">
            <div className="draw-icon" alt="draw" />
          </div>
        );
      } else if (results[i] === "L") {
        formToDisplay = formToDisplay.concat(
          <div className="leagueTableFormItem">
            <div className="loss-icon" alt="loss" />
          </div>
        );
      } else {
        formToDisplay = formToDisplay.concat("ERROR");
      }
    }
  } else {
    /* go from the most recent game to the 5th most recent */
    for (var i = results.length - 1; i > results.length - 6; i--) {
      if (results[i] === "W") {
        formToDisplay = formToDisplay.concat(
          <div className="leagueTableFormItem">
            <div className="win-icon" alt="win" />
          </div>
        );
      } else if (results[i] === "D") {
        formToDisplay = formToDisplay.concat(
          <div className="leagueTableFormItem">
            <div className="draw-icon" alt="draw" />
          </div>
        );
      } else if (results[i] === "L") {
        formToDisplay = formToDisplay.concat(
          <div className="leagueTableFormItem">
            <div className="loss-icon" alt="loss" />
          </div>
        );
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
        {/* {getForm(player.results)} */}
        {/* placeholder array being sent for now */}
        {/* {getForm(results)} */}
        {/* </td> */}
        <td align="center">{player.points}</td>
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
