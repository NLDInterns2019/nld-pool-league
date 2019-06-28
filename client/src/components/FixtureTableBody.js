import React from "react";

const FixtureTableBody = props => {
  const itemsToBeDisplayed = props.fixtures.map(fixture => {
    return (
      <tr key={fixture.seasonId+fixture.fixtureId}>
        <td align="center">{fixture.score1}</td>
        <td align="center">{fixture.player1}</td>
        <td align="center">VS</td>
        <td align="center">{fixture.player2}</td>
        <td align="center">{fixture.score2}</td>
      </tr>
    );
  });
  return <tbody>{itemsToBeDisplayed}</tbody>;
};

export default FixtureTableBody;
