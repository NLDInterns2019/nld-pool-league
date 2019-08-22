import React from "react";
import { maxBy, minBy, filter } from "lodash";
const itemsToBeDisplayed = props => {
  /**************
   * Top Player *
   **************/
  let topPlayer = filter(
    props.players,
    player =>
      player.winRate === maxBy(props.players, "winRate").winRate &&
      player.winRate !== 0
  );
  if (topPlayer.length) {
    topPlayer.staffName = topPlayer.map(player => (
      <div className="hall-of-fame-item">{player.staffName}</div>
    ));
    topPlayer.winRate = topPlayer[0].winRate;
  } else {
    topPlayer = null;
  }

  /*************
   * Best Season *
   *************/
  let bestGame = filter(
    props.players,
    player =>
      player.highestPoints ===
        maxBy(props.players, "highestPoints").highestPoints &&
      player.highestPoints !== 0
  );
  if (bestGame.length) {
    bestGame.staffName = bestGame.map(player => (
      <div className="hall-of-fame-item">{player.staffName}</div>
    ));
    bestGame.highestPoints = bestGame[0].highestPoints;
  } else {
    bestGame = null;
  }

  /***********
   * 4.0 GPA *
   ***********/
  let avgPoints = filter(
    props.players,
    player =>
      player.avgPoints === maxBy(props.players, "avgPoints").avgPoints &&
      player.avgPoints !== 0
  );
  if (avgPoints.length) {
    avgPoints.staffName = avgPoints.map(player => (
      <div className="hall-of-fame-item">{player.staffName}</div>
    ));
    avgPoints.avgPoints = avgPoints[0].avgPoints;
  } else {
    avgPoints = null;
  }

  /***********
   * Average *
   ***********/
  let draw = filter(
    props.players,
    player =>
      player.drawRate === maxBy(props.players, "drawRate").drawRate &&
      player.drawRate !== 0
  );
  if (draw.length) {
    draw.staffName = draw.map(player => (
      <div className="hall-of-fame-item">{player.staffName}</div>
    ));
    draw.drawRate = draw[0].drawRate;
  } else {
    draw = null;
  }

  /*************
   * Dedicated *
   *************/
  let dedicated = filter(
    props.players,
    player => player.plays === maxBy(props.players, "plays").plays
  );
  if (dedicated.length === 1) {
    dedicated = dedicated[0];
  } else {
    dedicated = null;
  }

  /****************
   * Dr. Punctual *
   ****************/
  let onTime = filter(
    props.players,
    player => player.punctRate === maxBy(props.players, "punctRate").punctRate
  );
  if (onTime.length === 1) {
    onTime = onTime[0];
  } else {
    onTime = null;
  }

  /*************
   * The Train *
   *************/
  let streak = filter(
    props.players,
    player =>
      player.winningStreak ===
        maxBy(props.players, "winningStreak").winningStreak &&
      player.winningStreak > 1
  );

  if (streak.length) {
    streak.staffName = streak.map(player => (
      <div className="hall-of-fame-item">{player.staffName}</div>
    ));
    streak.winningStreak = streak[0].winningStreak;
  } else {
    streak = null;
  }

  /***********
   * Scrappy *
   ***********/
  let scrappy = maxBy(props.players, "scrappyRate");
  if (scrappy !== undefined) {
    if (scrappy.scrappyRate === 0) {
      scrappy = null;
    }
  }

  /************
   * Improver *
   ************/
  let improved = maxBy(props.players, "latestWins");
  if (improved !== undefined) {
    if (improved.latestWins === 0) {
      improved = null;
    }
  }

  /**********
   * Casual *
   **********/
  let casual = filter(
    props.players,
    player =>
      player.lossRate === maxBy(props.players, "lossRate").lossRate &&
      player.lossRate !== 0
  );
  if (casual.length) {
    casual.staffName = casual.map(player => (
      <div className="hall-of-fame-item">{player.staffName}</div>
    ));
    casual.lossRate = casual[0].lossRate;
  } else {
    casual = null;
  }

  /***********
   * Slacker *
   ***********/
  let slacker = filter(
    props.players,
    player =>
      player.punctRate === minBy(props.players, "punctRate").punctRate &&
      player.punctRate !== 100 &&
      player.punctRate !== 0
  );
  if (slacker.length) {
    slacker.staffName = slacker.map(player => (
      <div className="hall-of-fame-item">{player.staffName}</div>
    ));
    slacker.punctRate = slacker[0].punctRate;
  } else {
    slacker = null;
  }

  /***********
   * In a Slump *
   ***********/
  let losingStreak = filter(
    props.players,
    player =>
      player.losingStreak ===
        maxBy(props.players, "losingStreak").losingStreak &&
      player.losingStreak > 1
  );
  if (losingStreak.length) {
    losingStreak.staffName = losingStreak.map(player => (
      <div className="hall-of-fame-item">{player.staffName}</div>
    ));
    losingStreak.losingStreak = losingStreak[0].losingStreak;
  } else {
    losingStreak = null;
  }

  /******************
   * Time to Retire *
   ******************/
  let retire = minBy(props.players, "latestWins");
  if (retire !== undefined) {
    if (retire.latestWins === 0) {
      retire = null;
    }
  }

  return (
    <tbody>
      <tr>
        <td className="hofCell">
          <div className="trophy-icon" alt="trophy" />
        </td>
        <td className="hofCell">Top Player</td>
        <td className="hofCell" style={{ fontWeight: "bold" }}>
          {topPlayer ? topPlayer.staffName : "-"}
        </td>
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
        <td className="hofCell">Best Season</td>
        <td className="hofCell" style={{ fontWeight: "bold" }}>
          {bestGame ? bestGame.staffName : "-"}
        </td>
        <td className="hofCell">
          {bestGame
            ? bestGame.highestPoints + " points in one season"
            : "Most points in a season"}
        </td>
      </tr>
      <tr>
        <td className="hofCell">
          <div className="book-icon" alt="book" />
        </td>
        <td className="hofCell">4.0 GPA</td>
        <td className="hofCell" style={{ fontWeight: "bold" }}>
          {avgPoints ? avgPoints.staffName : "-"}
        </td>
        <td className="hofCell">
          {avgPoints
            ? avgPoints.avgPoints + " points per game"
            : "Highest average PPG"}
        </td>
      </tr>
      <tr>
        <td className="hofCell">
          <div className="scales-icon" alt="scales" />
        </td>
        <td className="hofCell">Average</td>
        <td className="hofCell" style={{ fontWeight: "bold" }}>
          {draw ? draw.staffName : "-"}
        </td>
        <td className="hofCell">
          {draw ? draw.drawRate + "% of games drawn" : "Best average draw rate"}
        </td>
      </tr>
      <tr>
        <td className="hofCell">
          <div className="weightlifting-icon" alt="weightlifting" />
        </td>
        <td className="hofCell">Dedicated</td>
        <td
          className="hofCell"
          style={{
            fontWeight: "bold",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem"
          }}
        >
          {dedicated ? dedicated.staffName : "-"}
        </td>
        <td className="hofCell">
          {dedicated ? dedicated.plays + " games played" : "Most games played"}
        </td>
      </tr>
      <tr>
        <td className="hofCell">
          <div className="clock-icon" alt="clock" />
        </td>
        <td className="hofCell">Dr. Punctual</td>
        <td
          className="hofCell"
          style={{
            fontWeight: "bold",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem"
          }}
        >
          {onTime ? onTime.staffName : "-"}
        </td>
        <td className="hofCell">
          {onTime ? onTime.punctRate + "% punctuality" : "Fewest late fixtures"}
        </td>
      </tr>
      <tr>
        <td className="hofCell">
          <div className="train-icon" alt="train" />
        </td>
        <td className="hofCell">The Train</td>
        <td className="hofCell" style={{ fontWeight: "bold" }}>
          {streak ? streak.staffName : "-"}
        </td>
        <td className="hofCell">
          {streak ? streak.winningStreak + " win streak" : "Longest win streak"}
        </td>
      </tr>
      <tr>
        <td className="hofCell">
          <div className="boxing-icon" alt="boxing" />
        </td>
        <td className="hofCell">Scrappy</td>
        <td
          className="hofCell"
          style={{
            fontWeight: "bold",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem"
          }}
        >
          {scrappy ? scrappy.staffName : "-"}
        </td>
        <td className="hofCell">
          {scrappy
            ? scrappy.scrappyRate + "% wins against 1st"
            : "Best win % against 1st"}
        </td>
      </tr>
      <tr>
        <td className="hofCell">
          <div className="graph-icon" alt="graph" />
        </td>
        <td className="hofCell">Improver</td>
        <td
          className="hofCell"
          style={{
            fontWeight: "bold",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem"
          }}
        >
          {improved ? improved.staffName : "-"}
        </td>
        <td className="hofCell">
          {improved
            ? improved.latestWins + "% improvement"
            : "Greatest improvement"}
        </td>
      </tr>
      <tr>
        <td className="hofCellBad">
          <div className="angry-icon" alt="angry" />
        </td>
        <td className="hofCellBad">Filthy Casual</td>
        <td className="hofCellBad" style={{ fontWeight: "bold" }}>
          {casual ? casual.staffName : "-"}
        </td>
        <td className="hofCellBad">
          {casual ? casual.lossRate + "% of games lost" : "Highest loss rate"}
        </td>
      </tr>
      <tr>
        <td className="hofCellBad">
          <div className="snail-icon" alt="snail" />
        </td>
        <td className="hofCellBad">Slacker</td>
        <td className="hofCellBad" style={{ fontWeight: "bold" }}>
          {slacker ? slacker.staffName : "-"}
        </td>
        <td className="hofCellBad">
          {slacker ? slacker.punctRate + "% punctuality" : "Most late fixtures"}
        </td>
      </tr>

      <tr>
        <td className="hofCellBad">
          <div className="falling-man-icon" alt="falling man" />
        </td>
        <td className="hofCellBad">In a Slump</td>
        <td className="hofCellBad" style={{ fontWeight: "bold" }}>
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
        <td
          className="hofCellBad"
          style={{
            fontWeight: "bold",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem"
          }}
        >
          {retire ? retire.staffName : "-"}
        </td>
        <td className="hofCellBad">
          {retire ? retire.latestWins + "% deterioration" : "Biggest decline"}
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
