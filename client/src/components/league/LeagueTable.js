import React from "react";
import LeagueTableBody from "./LeagueTableBody";
import LeagueTableHeader from "./LeagueTableHeader";

const LeagueTable = props => {
  return (
    <div className="leagueTableContainer">
      <h3>{"Season " + props.activeSeason}: League Table</h3>
      <table className="leagueTable" cellSpacing="0">
        <LeagueTableHeader />
        <LeagueTableBody deletePlayer={props.deletePlayer} players={props.players} />
      </table>
      <p style={{textAlign: "left", color: "red"}}>Click player name to delete</p>
    </div>
  );
};

export default LeagueTable;
