import React from "react";
import LeagueTableBody from "./LeagueTableBody";

const LeagueTable = props => {
  return (
    <div className="leagueTableContainer">
      <h2>League Table</h2>
      <table className="leagueTable" cellSpacing="0">
        <thead>
        <tr>
          <th>Pos</th>
          <th>Seasons</th>
          <th>Name</th>
          <th>P</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>F</th>
          <th>A</th>
          <th>Pts</th>
        </tr>
        </thead>
        <LeagueTableBody players={props.players} />
      </table>
    </div>
  );
};

export default LeagueTable;
