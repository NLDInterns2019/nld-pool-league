import React from "react";

const FixtureTableBody = props => {
  const itemsToBeDisplayed = props.fixtures.map(fixture => {
    return (
      <tr key={fixture.id}>
        <td align="center" className="fixtureTableCell" id="tableScore1">
          {fixture.score1}
        </td>
        <td align="center" className="fixtureTableCell" id="tablePlayer1">
          {fixture.player1}
        </td>
        <td align="center" className="fixtureTableCell">
          VS
        </td>
        <td align="center" className="fixtureTableCell" id="tablePlayer2">
          {fixture.player2}
        </td>
        <td align="center" className="fixtureTableCell" id="tableScore2">
          {fixture.score2}
        </td>
      </tr>
    );
  });
  return <tbody>{itemsToBeDisplayed}</tbody>;
};

export default FixtureTableBody;
