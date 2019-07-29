import React from "react";
import HoFTableBody from "./HoFTableBody";

const HoFTable = props => {
  return (
    <div className="leagueTableContainer">
      <table className="HoFTable" cellSpacing="0">
        <HoFTableBody players={props.players} />
      </table>
    </div>
  );
};

export default HoFTable;
