import React from "react";
import LeagueTableBody from "./LeagueTableBody";
import LeagueTableHeader from "./LeagueTableHeader";

const LeagueTable = props => {
  return (
    <div className="leagueTableContainer">
      <h3>{"Season " + props.activeSeason}: League Table</h3>
      <table className="leagueTable" cellSpacing="0">
        <LeagueTableHeader />
        <LeagueTableBody players={props.players} />
      </table>
    </div>
  );
};

export default LeagueTable;
