import React, { Component } from "react";
import TableHeader from "./TableHeader";

const FixtureTable = () => {
  var scoreStyle = {
    fontWeight: "bold",
    color: "red"
  };

  return (
    <div className="fixtureTableContainer">
      <h2>Fixtures</h2>
      <table className="fixtureTable" cellSpacing="0">
        <TableHeader items={["Score", "Name", "", "Name", "Score"]} />
        <tr>
          <td align="center" style={scoreStyle}>
            2
          </td>
          <td align="center">Chris</td>
          <td align="center">vs</td>
          <td align="center">Steve</td>
          <td align="center" style={scoreStyle}>
            0
          </td>
        </tr>
        <tr>
          <td align="center" style={scoreStyle}>
            1
          </td>
          <td align="center">Steve</td>
          <td align="center">vs</td>
          <td align="center">Chris</td>
          <td align="center" style={scoreStyle}>
            1
          </td>
        </tr>
      </table>
    </div>
  );
};

export default FixtureTable;
