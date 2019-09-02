import React from "react";
import FixtureTableBody from "./FixtureTableBody";
import FixtureTableHeader from "./FixtureTableHeader";

/* component contains just a table header and body */
const FixtureTable = props => {
  if (props.fixtures.length === 0) {
    return null;
  }
  return (
    <div className="fixtureTableContainer">
      <table className="fixtureTable" cellSpacing="0">
        <FixtureTableHeader round={props.round} fixtures={props.fixtures} />
        <FixtureTableBody fixtures={props.fixtures} />
      </table>
    </div>
  );
};

export default FixtureTable;
