import React from "react";

const LeagueTableHeader = () => {
  return (
    <thead>
      <tr>
        <th>Pos</th>
        <th>Name</th>
        <th>P</th>
        <th>W</th>
        <th>D</th>
        <th>L</th>
        <th>F</th>
        <th>A</th>
        {/* <th>Form</th> */}
        <th>Pts</th>
        <th>Paid?</th>
      </tr>
    </thead>
  );
};

export default LeagueTableHeader;
