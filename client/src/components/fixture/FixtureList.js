import React from "react";
import FixtureTable from "./FixtureTable";

/* component for displaying the fixtures on the right of the current season page */
const FixtureList = props => {
  const count = props.groupCount.count;
  let tableArray = [];

  for (let i = 0; i <= count; i++) {
    const fixtures = props.fixtures.filter(fixture => fixture.group === i);
    tableArray.push(
      <div key={i}>
        <FixtureTable fixtures={fixtures} round={i + 1} />
      </div>
    );
  }

  const tableToBeRender = tableArray.map(table => {
    return table;
  });

  return <div>{tableToBeRender}</div>;
};

export default FixtureList;
