import React from "react";

const FixtureTableBody = props => {
  const itemsToBeDisplayed = props.fixtures.map(fixture => {
    return (
      <tr key={fixture.seasonId + fixture.fixtureId}>
        <td align="center" className="fixtureTableCell">
          {fixture.score1}
        </td>
        <td align="center" className="fixtureTableCell">
          {fixture.player1}
        </td>
        <td align="center" className="fixtureTableCell">
          VS
        </td>
        <td align="center" className="fixtureTableCell">
          {fixture.player2}
        </td>
        <td align="center" className="fixtureTableCell">
          {fixture.score2}
        </td>
      </tr>
    );
  });
  return <tbody>{itemsToBeDisplayed}</tbody>;
};

export default FixtureTableBody;
