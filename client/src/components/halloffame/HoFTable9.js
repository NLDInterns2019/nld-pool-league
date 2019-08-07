import React from "react";
import { maxBy, minBy } from "lodash";
const itemsToBeDisplayed = props => {
  let topPlayer = maxBy(props.HoF9, "winRate");
  let casual = maxBy(props.HoF9, "lossRate");
  let draw = maxBy(props.HoF9, "draws");
  let dedicated = maxBy(props.HoF9, "plays");
  let undedicated = minBy(props.HoF9, "plays");
  let onTime = minBy(props.HoF9, "punctRate");
  let slacker = maxBy(props.HoF9, "punctRate");
  let bestGame = maxBy(props.HoF9, "highestPoints");
  let losingStreak = maxBy(props.HoF9, "losingStreak");
  let streak = maxBy(props.HoF9, "winningStreak");
  let scrappy = maxBy(props.HoF9, "scrappyRate");
  let improved = maxBy(props.HoF9, "improvement");
  let retire = minBy(props.HoF9, "improvement");

  if (topPlayer !== undefined) {
    if (topPlayer.winRate === 0) {
      topPlayer = null;
    }
  }

  if (losingStreak !== undefined) {
    if (losingStreak.losingStreak === 0) {
      losingStreak = null;
    }
  }

  if (bestGame !== undefined) {
    if (bestGame.highestPoints === 0) {
      bestGame = null;
    }
  }

  if (draw !== undefined) {
    if (draw.drawRate === 0) {
      draw = null;
    }
  }

  if (scrappy !== undefined) {
    if (scrappy.scrappyRate === 0) {
      scrappy = null;
    }
  }

  if (streak !== undefined) {
    if (streak.winningStreak === 0) {
      streak = null;
    }
  }
  if (improved !== undefined) {
    if (improved.improvement === 0) {
      improved = null;
      retire = null;
    }
  }
  if (dedicated !== undefined) {
    if (dedicated === undedicated) {
      dedicated = null;
    }
  }

  if (slacker !== undefined) {
    if (slacker.punctRate === 0) {
      slacker = null;
    }
  }

  return (
    <tbody>
      <tr>
        <td className="hofCell">
          <div className="trophy-icon" alt="trophy" />
        </td>
        <td className="hofCell">Top Player</td>
        <td className="hofCell">{topPlayer ? topPlayer.staffName : "-"}</td>
        <td className="hofCell">
          {topPlayer
            ? topPlayer.winRate + "% games won"
            : "Best average win rate"}
        </td>
      </tr>
      <tr>
        <td className="hofCell">
          <div className="thumbs-up-icon" alt="thumbs up" />
        </td>
        <td className="hofCell">Best Game</td>
        <td className="hofCell">{bestGame ? bestGame.staffName : "-"}</td>
        <td className="hofCell">
          {bestGame
            ? bestGame.highestPoints + " points in one season"
            : "Most points in a league"}
        </td>
      </tr>
      <tr>
        <td className="hofCell">
          <div className="scales-icon" alt="scales" />
        </td>
        <td className="hofCell">Average</td>
        <td className="hofCell">{draw ? draw.staffName : "-"}</td>
        <td className="hofCell">
          {draw ? draw.drawRate + "% of games drawn" : "Best average draw rate"}
        </td>
      </tr>
      <tr>
        <td className="hofCell">
          <div className="weightlifting-icon" alt="weightlifting" />
        </td>
        <td className="hofCell">Dedicated</td>
        <td className="hofCell">{dedicated ? dedicated.staffName : "-"}</td>
        <td className="hofCell">
          {dedicated ? dedicated.plays + " games played" : "Most games played"}
        </td>
      </tr>
      <tr />
      <tr>
        <td className="hofCell">
          <div className="clock-icon" alt="clock" />
        </td>
        <td className="hofCell">Dr. Punctual</td>
        <td className="hofCell">{onTime ? onTime.staffName : "-"}</td>
        <td className="hofCell">
          {slacker
            ? onTime.punctRate + "% punctuality"
            : "Fewest late fixtures"}
        </td>
      </tr>
      <tr>
        <td className="hofCell">
          <div className="train-icon" alt="train" />
        </td>
        <td className="hofCell">The Train</td>
        <td className="hofCell">{streak ? streak.staffName : "-"}</td>
        <td className="hofCell">
          {streak ? streak.winningStreak + " win streak" : "Longest win streak"}
        </td>
      </tr>
      <tr>
        <td className="hofCell">
          <div className="boxing-icon" alt="boxing" />
        </td>
        <td className="hofCell">Scrappy</td>
        <td className="hofCell">{scrappy ? scrappy.staffName : "-"}</td>
        <td className="hofCell">
          {scrappy
            ? scrappy.scrappyRate + "% wins against " + topPlayer.staffName
            : "Best win % against #1"}
        </td>
      </tr>
      <tr>
        <td className="hofCell">
          <div className="graph-icon" alt="graph" />
        </td>
        <td className="hofCell">Improver</td>
        <td className="hofCell">{improved ? improved.staffName : "-"}</td>
        <td className="hofCell">
          {improved
            ? improved.improvement + "% improvement"
            : "Greatest improvement"}
        </td>
      </tr>
      <tr>
        <td className="hofCellBorder">
          <div className="angry-icon" alt="angry" />
        </td>
        <td className="hofCellBorder">Filthy Casual</td>
        <td className="hofCellBorder">{casual ? casual.staffName : "-"}</td>
        <td className="hofCellBorder">
          {casual ? casual.lossRate + "% of games lost" : "Highest loss rate"}
        </td>
      </tr>
      <tr>
        <td className="hofCellBad">
          <div className="snail-icon" alt="snail" />
        </td>
        <td className="hofCellBad">Slacker</td>
        <td className="hofCellBad">{slacker ? slacker.staffName : "-"}</td>
        <td className="hofCellBad">
          {slacker ? slacker.punctRate + "% games late" : "Most late fixtures"}
        </td>
      </tr>

      <tr>
        <td className="hofCellBad">
          <div className="falling-man-icon" alt="falling man" />
        </td>
        <td className="hofCellBad">In a Slump</td>
        <td className="hofCellBad">
          {losingStreak ? losingStreak.staffName : "-"}
        </td>
        <td className="hofCellBad">
          {losingStreak
            ? losingStreak.losingStreak + " losing streak"
            : "Longest losing streak"}
        </td>
      </tr>
      <tr>
        <td className="hofCellBad">
          <div className="downward-graph-icon" alt="downward-graph" />
        </td>
        <td className="hofCellBad">Time to Retire</td>
        <td className="hofCellBad">{improved ? improved.staffName : "-"}</td>
        <td className="hofCellBad">
          {retire ? retire.improvement + "% improvement" : "Biggest decline"}
        </td>
      </tr>
    </tbody>
  );
};

const HoFTable = props => {
  return (
    <div>
      <div className="achievementTableContainer">
        <table
          className="achievementTable"
          style={{ width: "650px" }}
          cellSpacing="0"
        >
          <thead>
            <tr>
              <th colSpan="2">Achievement</th>
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