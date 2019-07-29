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
  const improved = maxBy(props.players, "improvement");

  return (
    <tbody>
      <tr>
        <td className="hofCell">
          <div className="trophy-icon" alt="trophy" />
        </td>
        <td className="hofCell">Top Player</td>
        <td className="hofCell">{topPlayer ? topPlayer.staffName : "-"}</td>
        <td className="hofCell">
          {topPlayer ? topPlayer.percentage : "-"}% of games won
        </td>
      </tr>
      <tr>
        <td className="hofCell">
          <div className="thumbs-up-icon" alt="thumbs up" />
        </td>
        <td className="hofCell">Best Game</td>
        <td className="hofCell">{bestGame ? bestGame.staffName : "-"}</td>
        <td className="hofCell">
          {bestGame ? bestGame.maxGoals : "-"} points in one match
        </td>
      </tr>
      <tr>
        <td className="hofCell">
          <div className="scales-icon" alt="scales" />
        </td>
        <td className="hofCell">Most average</td>
        <td className="hofCell">{draw ? draw.staffName : "-"}</td>
        <td className="hofCell">
          {draw ? draw.drawRate : "-"}% of games drawn
        </td>
      </tr>
      <tr>
        <td className="hofCell">
          <div className="angry-icon" alt="angry" />
        </td>
        <td className="hofCell">oh no</td>
        <td className="hofCell">{ohno ? ohno.staffName : "-"}</td>
        <td className="hofCell">
          {ohno ? ohno.percentage : "-"}% of games won :(
        </td>
      </tr>
      <tr>
        <td className="hofCell">
          <div className="weightlifting-icon" alt="weightlifting" />
        </td>
        <td className="hofCell">Dedicated</td>
        <td className="hofCell">{dedicated ? dedicated.staffName : "-"}</td>
        <td className="hofCell">
          {dedicated ? dedicated.plays : "-"} games played
        </td>
      </tr>
      <tr />
      <tr>
        <td className="hofCell">
          <div className="clock-icon" alt="clock" />
        </td>
        <td className="hofCell">Mr. Punctual</td>
        <td className="hofCell">{onTime ? onTime.staffName : "-"}</td>
        <td className="hofCell">Fewest lates</td>
      </tr>
      <tr>
        <td className="hofCell">
          <div className="snail-icon" alt="snail" />
        </td>
        <td className="hofCell">Slacker</td>
        <td className="hofCell">{slacker ? slacker.staffName : "-"}</td>
        <td className="hofCell">
          {slacker ? slacker.punctRate : "-"}% games late
        </td>
      </tr>
      <tr>
        <td className="hofCell">
          <div className="train-icon" alt="train" />
        </td>
        <td className="hofCell">Longest streak</td>
        <td className="hofCell">{streak ? streak.staffName : "-"}</td>
        <td className="hofCell">{streak ? streak.streak : "-"} game streak!</td>
      </tr>
      <tr>
        <td className="hofCell">
          <div className="boxing-icon" alt="boxing" />
        </td>
        <td className="hofCell">Scrappy</td>
        <td className="hofCell">{scrappy ? scrappy.staffName : "-"}</td>
        <td className="hofCell">
          {scrappy ? scrappy.scrappyRate : "-"}% wins against{" "}
          {topPlayer ? topPlayer.staffName : "-"}!
        </td>
      </tr>
      <tr>
        <td className="hofCell">
          <div className="graph-icon" alt="graph" />
        </td>
        <td className="hofCell">Most improved</td>
        <td className="hofCell">{improved ? improved.staffName : "-"}</td>
        <td className="hofCell">
          {improved ? improved.improvemnet : "-"}% improvement
        </td>
      </tr>
    </tbody>
  );
};

const HoFTable = props => {
  return (
    <div>
      <div className="leagueTableContainer">
        <table
          className="leagueTable"
          style={{ width: "650px" }}
          cellSpacing="0"
        >
          <thead>
            <tr>
              <th />
              <th>Achievement</th>
              <th>Name</th>
              <th>Details</th>
            </tr>
          </thead>
          {itemsToBeDisplayed(props)}
        </table>
      </div>
    </div>
  );
};

export default HoFTable;
