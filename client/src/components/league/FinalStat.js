import React from "react";
import { find, maxBy, minBy, filter } from "lodash";

const itemsToBeDisplayed = props => {
  const undefeated = find(props.players, player => player.lose === 0);
  const draw = maxBy(filter(props.players, player => player.draw > 0), "draw");
  const firstTimer = maxBy(props.players, "goalsAgainst");
  const zero = find(props.players, player => player.win === 0);
  const onTime = maxBy(props.players, "punctuality");
  const late = minBy(
    filter(props.players, player => player.punctuality < 0),
    "punctuality"
  );

  return (
    <tbody>
      <tr>
        <td align="center">
          <div className="shield-icon" alt="shield" />
        </td>
        <td>Undefeated</td>
        <td>{undefeated ? undefeated.staffName : "-"}</td>
      </tr>
      <tr>
        <td align="center">
          <div className="scales-icon" alt="scales" />
        </td>
        <td>Most drawn</td>
        <td>{draw ? draw.staffName : "-"}</td>
      </tr>
      <tr>
        <td align="center">
          <div className="one-icon" alt="one" />
        </td>
        <td>First timer</td>
        <td>{firstTimer ? firstTimer.staffName : "-"}</td>
      </tr>
      <tr>
        <td align="center">
          <div className="zero-icon" alt="zero" />
        </td>
        <td>Zero win</td>
        <td>{zero ? zero.staffName : "-"}</td>
      </tr>
      <tr>
        <td align="center">
          <div className="clock-icon" alt="clock" />
        </td>
        <td>Mr. Punctual</td>
        <td>{onTime ? onTime.staffName : "-"}</td>
      </tr>
      <tr>
        <td align="center">
          <div className="snail-icon" alt="snail" />
        </td>
        <td>Mr. Overdue</td>
        <td>{late ? late.staffName : "-"}</td>
      </tr>
    </tbody>
  );
};

const FinalStat = props => {
  return (
    <div>
      <div className="finalStatsTitleContainer">
        <div className="swords-icon" alt="swords" />
        <h3>Honorable Mentions </h3>
        <div className="swords-icon" alt="swords" />
      </div>
      <div className="finalStatsTableContainer">
        <table
          className="finalStatsTable"
          style={{ width: "500px" }}
          cellSpacing="0"
        >
          <thead>
            <tr>
              <th colSpan="2">Achievement</th>
              <th>Name</th>
            </tr>
          </thead>
          {itemsToBeDisplayed(props)}
        </table>
      </div>
    </div>
  );
};

export default FinalStat;
