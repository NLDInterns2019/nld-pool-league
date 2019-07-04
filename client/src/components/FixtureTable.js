import React from "react";
import FixtureTableBody from "./FixtureTableBody";
import FixtureTableHeader from "./FixtureTableHeader";

const FixtureTable = props => {
  return (
    <div className="fixtureTableContainer">
      <h3>List of Fixtures</h3>
      <table className="fixtureTable" cellSpacing="0">
        <FixtureTableHeader />
        <FixtureTableBody fixtures={props.fixtures} />
      </table>
    </div>
  );
};

export default FixtureTable;
