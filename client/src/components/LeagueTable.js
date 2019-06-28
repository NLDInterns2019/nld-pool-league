import React from "react";

const LeagueTable = () => {
  return (
    <div className="leagueTableContainer">
      <h2>League Table</h2>
      <table className="leagueTable" cellSpacing="0">
        <tr>
          <th>Pos</th>
          <th>Name</th>
          <th>P</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>F</th>
          <th>A</th>
          <th>Pts</th>
        </tr>
        <tr>
          <td className="position" align="center">
            1
          </td>
          <td className="name" align="center">
            Chris
          </td>
          <td className="played" align="center">
            2
          </td>
          <td className="wins" align="center">
            1
          </td>
          <td className="draws" align="center">
            1
          </td>
          <td className="losses" align="center">
            0
          </td>
          <td className="for" align="center">
            3
          </td>
          <td className="against" align="center">
            1
          </td>
          <td className="points" align="center">
            4
          </td>
        </tr>
        <tr>
          <td className="position" align="center">
            2
          </td>
          <td className="name" align="center">
            Steve
          </td>
          <td className="played" align="center">
            2
          </td>
          <td className="wins" align="center">
            0
          </td>
          <td className="draws" align="center">
            1
          </td>
          <td className="losses" align="center">
            1
          </td>
          <td className="for" align="center">
            1
          </td>
          <td className="against" align="center">
            3
          </td>
          <td className="points" align="center">
            1
          </td>
        </tr>
      </table>
    </div>
  );
};

export default LeagueTable;
