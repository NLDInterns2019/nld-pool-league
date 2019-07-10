import React from "react";
import FixtureTable from "./FixtureTable";

const FixtureList = props => {
  const count = props.groupCount.count;
  let tableArray = [];

  for (let i = 0; i < count; i++) {
    const fixtures = props.fixtures.filter(fixture => fixture.group === i);
    tableArray.push(
      <div>
        <FixtureTable key={i} fixtures={fixtures} />
      </div>
    );
  }

  const tableToBeRender = tableArray.map(table => {
    return table;
  });

  return <div>{tableToBeRender}</div>;
};

export default FixtureList;
