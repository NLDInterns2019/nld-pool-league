import React, { Component } from "react";

class FixtureTable extends Component {
  render() {
    return (
      <div>
        <table className="fixtureTable">
          <tr>
            <th>Score</th>
            <th>Name</th>
            <th />
            <th>Name</th>
            <th>Score</th>
          </tr>
          <tr>
            <td align="center">2</td>
            <td align="center">Chris</td>
            <td align="center">vs</td>
            <td align="center">Steve</td>
            <td align="center">0</td>
          </tr>
          <tr>
            <td align="center">1</td>
            <td align="center">Steve</td>
            <td align="center">vs</td>
            <td align="center">Chris</td>
            <td align="center">1</td>
          </tr>
        </table>
      </div>
    );
  }
}

export default FixtureTable;
