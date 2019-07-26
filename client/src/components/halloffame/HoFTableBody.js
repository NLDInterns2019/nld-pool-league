import React from "react";
import { find, maxBy, minBy, filter } from "lodash";

const itemsToBeDisplayed = props => {
  const topPlayer = maxBy(filter(props.players, player => player.percentage > 0), "draw");
  const bottomPlayer = minBy(filter(props.players, player => player.percentage > 0), "draw");
  const draw = maxBy(filter(props.players, player => player.draw > 0), "draw");
  const onTime = minBy(props.players, "punctuality");
  const late = maxBy(
    filter(props.players, player => player.punctuality < 0),
    "punctuality"
  );

  return (
    <tbody>
      <tr>
        <td>
          <span role="img" aria-label="boxing-glove">
          🏆
          </span>
        </td>
        <td>Top Player</td>
        <td>{topPlayer ? topPlayer.staffName : "-"}</td>
        <td>{topPlayer ? topPlayer.wins : "-"}% of games won</td>
      </tr>
      <tr>
        <td>
          <span role="img" aria-label="snail">
          🎷
          </span>
        </td>
        <td>Best Game</td>
        <td>{late ? late.staffName : "-"}</td>
        <td>{topPlayer ? topPlayer.staffName : "-"} points in one match</td>
      </tr>
      <tr>
        <td>
          <span role="img" aria-label="balance-scale">
            ⚖️
          </span>
        </td>
        <td>Most average</td>
        <td>{draw ? draw.staffName : "-"}</td>
        <td>{topPlayer ? draw.staffName : "-"}% of games drawn</td>
      </tr>
      <tr>
        <td>
          <span role="img" aria-label="dizzy">
            😵
          </span>
        </td>
        <td>oh no</td>
        <td>{bottomPlayer ? bottomPlayer.staffName : "-"}</td>
        <td>{topPlayer ? bottomPlayer.staffName : "-"}% of games won :(</td>
      </tr>
      <tr>
        <td>
          <span role="img" aria-label="watch">
          🏋️
          </span>
        </td>
        <td>Dedicated</td>
        <td>{onTime ? onTime.staffName : "-"}</td>
        <td>{topPlayer ? topPlayer.staffName : "-"} games played</td>
      </tr>
      <tr></tr>
      <tr>
        <td>
          <span role="img" aria-label="watch">
            ⌚
          </span>
        </td>
        <td>Mr. Punctual</td>
        <td>{onTime ? onTime.staffName : "-"}</td>
        <td>Fewest lates</td>
      </tr>
      <tr>
        <td>
          <span role="img" aria-label="snail">
            🐌
          </span>
        </td>
        <td>Slacker</td>
        <td>{late ? late.staffName : "-"}</td>
        <td>{topPlayer ? topPlayer.staffName : "-"}% games late</td>
      </tr>
      <tr>
        <td>
          <span role="img" aria-label="snail">
          🏃
          </span>
        </td>
        <td>Longest streak</td>
        <td>{late ? late.staffName : "-"}</td>
        <td>{topPlayer ? topPlayer.staffName : "-"} game streak!</td>
      </tr>
      <tr>
        <td>
          <span role="img" aria-label="snail">
          🥊
          </span>
        </td>
        <td>Scrappy</td>
        <td>{late ? late.staffName : "-"}</td>
        <td>{topPlayer ? topPlayer.staffName : "-"}% wins against {topPlayer ? topPlayer.wins : "-"}!</td>
      </tr>
      
    </tbody>
  );
};

const FinalStat = props => {
  return (
    <div>
      <div className="leagueTableContainer">
        <table
          className="leagueTable"
          style={{ width: "500px" }}
          cellSpacing="0"
        >
          <thead>
            <tr>
              <th />
              <th>Achievement</th>
              <th>Name</th>
              <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Details&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
            </tr>
          </thead>
          {itemsToBeDisplayed(props)}
        </table>
      </div>
    </div>
  );
};

export default FinalStat;
