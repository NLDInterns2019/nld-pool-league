import React from "react";

const LeagueTableHeader = () => {
  return (
    <thead>
      <tr>
        <th>Pos</th>
        <th>Name</th>
        <th>P</th>
        <th className="leagueTableWin">W</th>
        <th className="leagueTableDraw">D</th>
        <th className="leagueTableLose">L</th>
        <th className="leagueTableFor">F</th>
        <th className="leagueTableAgainst">A</th>
        <th>Form</th>
        <th>Pts</th>
        <th>Paid?</th>
      </tr>
    </thead>
  );
};

export default LeagueTableHeader;
