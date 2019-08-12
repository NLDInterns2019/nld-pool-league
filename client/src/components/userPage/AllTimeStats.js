import React from "react";

const AllTimeStats = props => {
  return (
    <div>
      <h2 style={{ textAlign: "left", marginLeft: "18px" }}>All-time:</h2>
      <div className="all-time-stats">
        <div className="points-per-game">
          <h4>Avg. Points Per Game:</h4>
          <div className="stat">{props.getPPG}</div>
        </div>
        <div className="win-percentage">
          <h4>Win Percentage:</h4>
          <div className="stat">{props.getWinPercentage}</div>
        </div>
      </div>
    </div>
  );
};

export default AllTimeStats;
