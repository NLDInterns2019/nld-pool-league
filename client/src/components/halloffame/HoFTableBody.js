import React from "react";
import { find, maxBy, minBy, filter } from "lodash";

const itemsToBeDisplayed = props => {
  const topPlayer = maxBy(props.players, "percentage");
  const ohno = minBy(props.players, "percentage");
  const draw = maxBy(props.players, "draws");
  const dedicated = maxBy(props.players, "plays");
  const onTime = minBy(props.players, "punctRate");
  const slacker = maxBy(props.players, "punctRate");
  const bestGame = maxBy(props.players, "maxGoals");
  const streak = maxBy(props.players, "streak");
  const scrappy = maxBy(props.players, "scrappyRate");

  return (
    <tbody>
      <tr>
        <td>
          <span role="img" aria-label="trophy">
          🏆
          </span>
        </td>
        <td>Top Player</td>
        <td>{topPlayer ? topPlayer.staffName : "-"}</td>
        <td>{topPlayer ? topPlayer.percentage : "-"}% of games won</td>
      </tr>
      <tr>
        <td>
          <span role="img" aria-label="saxophone">
          🎷
          </span>
        </td>
        <td>Best Game</td>
        <td>{bestGame ? bestGame.staffName : "-"}</td>
        <td>{bestGame ? bestGame.maxGoals : "-"} points in one match</td>
      </tr>
      <tr>
        <td>
          <span role="img" aria-label="balance-scale">
            ⚖️
          </span>
        </td>
        <td>Most average</td>
        <td>{draw ? draw.staffName : "-"}</td>
        <td>{draw ? draw.drawRate : "-"}% of games drawn</td>
      </tr>
      <tr>
        <td>
          <span role="img" aria-label="dizzy">
            😵
          </span>
        </td>
        <td>oh no</td>
        <td>{ohno ? ohno.staffName : "-"}</td>
        <td>{ohno ? ohno.percentage : "-"}% of games won :(</td>
      </tr>
      <tr>
        <td>
          <span role="img" aria-label="weights">
          🏋️
          </span>
        </td>
        <td>Dedicated</td>
        <td>{dedicated ? dedicated.staffName : "-"}</td>
        <td>{dedicated ? dedicated.plays : "-"} games played</td>
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
        <td>{slacker ? slacker.staffName : "-"}</td>
        <td>{slacker ? slacker.punctRate : "-"}% games late</td> 
      </tr>
      <tr>
        <td>
          <span role="img" aria-label="runner">
          🏃
          </span>
        </td>
        <td>Longest streak</td>
        <td>{streak ? streak.staffName : "-"}</td>
        <td>{streak ? streak.streak : "-"} game streak!</td>
      </tr>
      <tr>
        <td>
          <span role="img" aria-label="boxing-gloves">
          🥊
          </span>
        </td>
        <td>Scrappy</td>
        <td>{scrappy ? scrappy.staffName : "-"}</td>
        <td>{scrappy ? scrappy.scrappyRate : "-"}% wins against {topPlayer ? topPlayer.staffName : "-"}!</td>
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
