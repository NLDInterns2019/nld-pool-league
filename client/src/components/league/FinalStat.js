import React from "react";
import { find, maxBy, minBy, filter } from "lodash";

const itemsToBeDisplayed = props => {
  const undefeated = find(props.players, player => player.lose === 0);
  const draw = maxBy(props.players, "draw");
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
        <td>
          <span role="img" aria-label="boxing-glove">
            🥊
          </span>
        </td>
        <td>Undefeated</td>
        <td>{undefeated ? undefeated.staffName : "-"}</td>
      </tr>
      <tr>
        <td>
          <span role="img" aria-label="balance-scale">
            ⚖️
          </span>
        </td>
        <td>Most draw</td>
        <td>{draw ? draw.staffName : "-"}</td>
      </tr>
      <tr>
        <td>
          <span role="img" aria-label="dizzy">
            😵
          </span>
        </td>
        <td>First timer</td>
        <td>{firstTimer ? firstTimer.staffName : "-"}</td>
      </tr>
      <tr>
        <td>
          <span role="img" aria-label="zero">
            0️⃣
          </span>
        </td>
        <td>Zero win</td>
        <td>{zero ? zero.staffName : "-"}</td>
      </tr>
      <tr>
        <td>
          <span role="img" aria-label="watch">
            ⌚
          </span>
        </td>
        <td>Mr. on time</td>
        <td>{onTime ? onTime.staffName : "-"}</td>
      </tr>
      <tr>
        <td>
          <span role="img" aria-label="snail">
            🐌
          </span>
        </td>
        <td>Mr Snail</td>
        <td>{late ? late.staffName : "-"}</td>
      </tr>
    </tbody>
  );
};

const FinalStat = props => {
  return (
    <div>
      <h3>Honorable Mentions</h3>
      <div className="leagueTableContainer">
        <table
          className="leagueTable"
          style={{ width: "500px" }}
          cellSpacing="0"
        >
          <thead>
            <tr>
              <th />
              <th>Achievement Title</th>
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
