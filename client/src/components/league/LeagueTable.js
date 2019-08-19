import React from "react";
import LeagueTableBody from "./LeagueTableBody";
import LeagueTableHeader from "./LeagueTableHeader";
import AddPlayerForm from "./AddPlayerForm";
import auth0Client from "../../Auth";

const LeagueTable = props => {
  return (
    <div className="leagueTableContainer">
      {props.isPlayoff ? (
        <h3>Season {props.activeSeason} League Table (Playoff Underway)</h3>
      ) : (
        <h3>Season {props.activeSeason} League Table</h3>
      )}
      <table className="leagueTable" cellSpacing="0">
        <LeagueTableHeader />
        <LeagueTableBody
          deletePlayer={props.deletePlayer}
          players={props.players}
          feePaid={props.feePaid}
          hasFinished={props.hasFinished}
        />
      </table>
      {auth0Client.isAuthenticated() &&
      auth0Client.getProfile().nickname === "admin" &&
      !props.hasFinished &&
      !props.isPlayoff ? (
        <AddPlayerForm addPlayer={props.addPlayer} players={props.players} />
      ) : null}
    </div>
  );
};

export default LeagueTable;
