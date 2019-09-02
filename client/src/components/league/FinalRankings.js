import React from "react";

/* component for displaying the final rankings of a season */
const FinalRankings = props => {
  return (
    <div style={{ marginBottom: "4rem" }}>
      <div className="seasonClosed">
        <div className="chequered-flag-icon icon-100" alt="chequered flag" />
        <h1 style={{ fontSize: "40pt" }}>Season {props.season} has finished</h1>
        <div className="chequered-flag-icon icon-100" alt="chequered flag" />
      </div>
      <div className="finalRankings">
        <div className="finalRankingsItem">
          <div className="gold-medal-icon-large icon-120" alt="first place" />
          <h1 style={{ fontSize: "50pt" }}>
            {props.players[0].staffName} &nbsp;&nbsp; {props.players[0].points}{" "}
            pts
          </h1>
        </div>
        <div className="finalRankingsItem">
          <div className="silver-medal-icon-large icon-60" alt="second place" />
          <h1 style={{ fontSize: "36pt" }}>
            {props.players[1].staffName} &nbsp;&nbsp; {props.players[1].points}{" "}
            pts
          </h1>
        </div>
        <div className="finalRankingsItem">
          <div className="bronze-medal-icon-large icon-60" alt="third place" />
          {/* if there is someone in third place, display */}
          {props.players[2] ? (
            <h1 style={{ fontSize: "36pt" }}>
              {props.players[2].staffName} &nbsp;&nbsp;{" "}
              {props.players[2].points} pts
            </h1>
          ) : (
            <h1 style={{ fontSize: "36pt" }}>-</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinalRankings;
