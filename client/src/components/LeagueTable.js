import React from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

const LeagueTable = () => {
  return (
    <div className="leagueTableContainer">
      <h2>League Table</h2>
      <table className="leagueTable" cellSpacing="0">
        <TableHeader
          items={["Pos", "Name", "P", "W", "D", "L", "F", "A", "Pts"]}
        />
        <TableRow items={[1, "Chris", 2, 1, 1, 0, 3, 1, 4]} />
        <TableRow items={[2, "Steve", 2, 0, 1, 1, 1, 3, 1]} />
      </table>
    </div>
  );
};

export default LeagueTable;
