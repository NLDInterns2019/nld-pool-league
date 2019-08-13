import React from "react";
import LeagueTableBody from "./LeagueTableBody";
import LeagueTableHeader from "./LeagueTableHeader";
import AddPlayerForm from "./AddPlayerForm";

const LeagueTable = props => {
  return (
    <div className="leagueTableContainer">
      <h3>{"Season " + props.activeSeason}: League Table</h3>
      <table className="leagueTable" cellSpacing="0">
        <LeagueTableHeader />
        <LeagueTableBody
          deletePlayer={props.deletePlayer}
          players={props.players}
          feePaid={props.feePaid}
        />
      </table>
      <AddPlayerForm addPlayer={props.addPlayer} />
    </div>
  );
};

export default LeagueTable;
