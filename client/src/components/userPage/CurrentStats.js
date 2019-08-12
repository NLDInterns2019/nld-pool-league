import React from "react";
import Forms from "../league/Forms";

const CurrentStats = props => {
  return (
    <div>
    <h2 style={{ textAlign: "left", marginLeft: "18px" }}>Current Season:</h2>
    <div className="current-stats">
      <div className="current-league-pos">
        <h4>Current League Position:</h4>
        <div className="stat">
          <h4>{props.position >=0 ? props.position + 1 : "-"}</h4>
        </div>
      </div>
      <div className="current-form">
        <h4>Form:</h4>
        <Forms form={props.player ? props.player.form : []} />
      </div>
    </div>
    </div>
  );
};

export default CurrentStats;
