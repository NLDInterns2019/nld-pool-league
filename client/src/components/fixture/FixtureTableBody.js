import React from "react";
import moment from "moment";

// const today = new Date("27 Jul 2019");
const today = moment();

const cellStyle = (fixtureDate, score) => {
  if (isOverdue(fixtureDate) && isNotFinished(score)) {
    return { color: "white", backgroundColor: "#e23e4b", fontWeight: "bold" };
  } else {
    return { color: "black" };
  }
};

const score1CellStyle = (fixtureDate, score) => {
  if (isOverdue(fixtureDate) && isNotFinished(score)) {
    return {
      borderRightColor: "#e23e4b"
    };
  } else {
    return { color: "black" };
  }
};

const score2CellStyle = (fixtureDate, score) => {
  if (isOverdue(fixtureDate) && isNotFinished(score)) {
    return {
      borderLeftColor: "#e23e4b"
    };
  } else {
    return { color: "black" };
  }
};

const isOverdue = fixtureDate => {
  return moment(fixtureDate).isBefore(today);
  //return fixtureDate < today;
};

const isNotFinished = score => {
  return score === null;
};

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
