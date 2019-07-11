import React from "react";
import FixtureTableBody from "./FixtureTableBody";
import FixtureTableHeader from "./FixtureTableHeader";

const FixtureTable = props => {
  if(props.fixtures.length === 0){
    return null;
  }
  return (
    <div className="fixtureTableContainer">
      <h3>Round {props.round}</h3>
      <p>Due {props.fixtures[0].date}</p>
      <table className="fixtureTable" cellSpacing="0">
        <FixtureTableHeader />
        <FixtureTableBody fixtures={props.fixtures} />
      </table>
    </div>
  );
};

export default FixtureTable;
