import React, { Component } from "react";

class FixtureTable extends Component {
  render() {
    var scoreStyle = {
      fontWeight: "bold",
      color: "red"
    };

    return (
      <div>
        <h2>Fixtures</h2>
        <table className="table">
          <tr>
            <th>Score</th>
            <th>Name</th>
            <th />
            <th>Name</th>
            <th>Score</th>
          </tr>
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
  }
}

export default FixtureTable;
