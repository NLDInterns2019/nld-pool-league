import React from "react";
import TableHeader from "./TableHeader";
import TableBody from "./LeagueTableBody";

const FixtureTable = () => {
  var scoreStyle = {
    fontWeight: "bold",
    color: "red"
  };

  return (
    <div className="fixtureTableContainer">
      <h2>Fixtures</h2>
      <table className="fixtureTable" cellSpacing="0">
        <TableHeader items={["Score", "Name", "", "Name", "Score"]} />
      </table>
    </div>
  );
};

export default FixtureTable;
