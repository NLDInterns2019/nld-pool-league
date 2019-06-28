import React from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

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
        <TableRow items={[2, "Chris", "vs", "Steve", 0]} />
        <TableRow items={[1, "Steve", "vs", "Chris", 1]} />
      </table>
    </div>
  );
};

export default FixtureTable;
