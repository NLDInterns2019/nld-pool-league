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
          <div className="shield-icon icon-24" alt="shield" />
        </td>
        <td className="achievementTitle">
          Undefeated
          <span className="tooltiptext">Player with no losses</span>
        </td>
        <td className="name">{undefeated ? undefeated.staffName : "-"}</td>
      </tr>
      <tr>
        <td align="center">
          <div className="scales-icon icon-24" alt="scales" />
        </td>
        <td className="achievementTitle">
          Most drawn
          <span className="tooltiptext">Player with the most draws</span>
        </td>
        <td className="name">{draw ? draw.staffName : "-"}</td>
      </tr>
      <tr>
        <td align="center">
          <div className="thumbs-down-icon icon-24" alt="thumbs down" />
        </td>
        <td className="achievementTitle">
          Liability
          <span className="tooltiptext">
            Player with the most points against
          </span>
        </td>
        <td className="name">{firstTimer ? firstTimer.staffName : "-"}</td>
      </tr>
      <tr>
        <td align="center">
          <div className="zero-icon icon-24" alt="zero" />
        </td>
        <td className="achievementTitle">
          Zero win
          <span className="tooltiptext">Player with zero wins</span>
        </td>
        <td className="name">{zero ? zero.staffName : "-"}</td>
      </tr>
      <tr>
        <td align="center">
          <div className="clock-icon icon-24" alt="clock" />
        </td>
        <td className="achievementTitle">
          Dr. Punctual
          <span className="tooltiptext">Player with the fewest lates</span>
        </td>
        <td className="name">{onTime ? onTime.staffName : "-"}</td>
      </tr>
      <tr>
        <td align="center">
          <div className="snail-icon icon-24" alt="snail" />
        </td>
        <td className="achievementTitle">
          Slacker
          <span className="tooltiptext">Player with the most lates</span>
        </td>
        <td className="name">{late ? late.staffName : "-"}</td>
      </tr>
    </tbody>
  );
};

const FinalStat = props => {
  return (
    <div>
      <div className="finalStatsTitleContainer">
        <div className="swords-icon icon-40" alt="swords" />
        <h3>Honourable Mentions </h3>
        <div className="swords-icon icon-40" alt="swords" />
      </div>
      <div className="finalStatsTableContainer">
        <table
          className="finalStatsTable"
          style={{ width: "500px" }}
          cellSpacing="0"
        >
          <thead>
            <tr>
              <th />
              <th>Achievement</th>
              <th className="name">Name</th>
            </tr>
          </thead>
          {itemsToBeDisplayed(props)}
        </table>
      </div>
    </div>
  );
};

export default FinalStat;
