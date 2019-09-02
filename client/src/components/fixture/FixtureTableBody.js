import React from "react";
import moment from "moment";

// const today = new Date("27 Jul 2019");
const today = moment();

/* sets style of the cells depending on whether a fixture is overdue anD unplayed */
const cellStyle = (fixtureDate, score) => {
  if (isOverdue(fixtureDate) && isNotFinished(score)) {
    return {
      color: "white",
      backgroundColor: "#e23e4b" /* red */,
      fontWeight: "bold"
    };
  } else {
    return { color: "black" };
  }
};

/* sets style for the left score cell depending on where the fixture is overdue and unplayed */
const score1CellStyle = (fixtureDate, score) => {
  if (isOverdue(fixtureDate) && isNotFinished(score)) {
    return {
      borderRightColor: "#e23e4b" /* red */
    };
  } else {
    return { color: "black" };
  }
};

/* sets style for the right score cell depending on where the fixture is overdue and unplayed */
const score2CellStyle = (fixtureDate, score) => {
  if (isOverdue(fixtureDate) && isNotFinished(score)) {
    return {
      borderLeftColor: "#e23e4b"
    };
  } else {
    return { color: "black" };
  }
};

/* checks if the given date is before today, returns true if it is */
const isOverdue = fixtureDate => {
  return moment(fixtureDate).isBefore(today);
};

/* checks if a fixture hasn't been played by sending it a score and returning if a score has been submitted or not */
const isNotFinished = score => {
  return score === null;
};

/* displays fixtures as follows:      SCORE 1 | PLAYER 1 | VS | PLAYER 2 | SCORE 2 */
const FixtureTableBody = props => {
  const itemsToBeDisplayed = props.fixtures.map(fixture => {
    return (
      <tr key={fixture.id}>
        <td
          align="center"
          className="fixtureTableCell"
          id="tableScore1"
          style={score1CellStyle(fixture.date, fixture.score1)}
        >
          {fixture.score1}
        </td>
        <td
          align="center"
          className="fixtureTableCell"
          id="tablePlayer1"
          style={cellStyle(fixture.date, fixture.score1)}
        >
          {fixture.player1}
        </td>
        <td
          align="center"
          className="fixtureTableCell"
          style={cellStyle(fixture.date, fixture.score1)}
        >
          VS
        </td>
        <td
          align="center"
          className="fixtureTableCell"
          id="tablePlayer2"
          style={cellStyle(fixture.date, fixture.score1)}
        >
          {fixture.player2}
        </td>
        <td
          align="center"
          className="fixtureTableCell"
          id="tableScore2"
          style={score2CellStyle(fixture.date, fixture.score1)}
        >
          {fixture.score2}
        </td>
      </tr>
    );
  });
  return <tbody>{itemsToBeDisplayed}</tbody>;
};

export default FixtureTableBody;
