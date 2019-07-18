import React from "react";

const FixtureTableHeader = props => {
  return (
    <thead>
      <tr>
        <th colSpan="2" style={{ textAlign: "left" }}>
          Round {props.round}
        </th>

        <th colSpan="3" style={{ textAlign: "right" }}>
          Due:&nbsp;
          {new Date(parseInt(props.fixtures[0].date))
            .toString()
            .split(" ")
            .slice(1, 4)
            .join("-")}
        </th>
      </tr>
    </thead>
  );
};

export default FixtureTableHeader;
