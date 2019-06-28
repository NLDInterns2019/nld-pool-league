import React from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

const LeagueTable = (props) => {
  return (
    <div className="leagueTableContainer">
      <h2>League Table</h2>
      <table className="leagueTable" cellSpacing="0">
        <TableHeader
          items={["Pos", "Name", "P", "W", "D", "L", "F", "A", "Pts"]}
        />
        <TableBody players={props.players}/>
      </table>
    </div>
  );
};

export default LeagueTable;
