import React from "react";
import moment from "moment";

const FixtureTableHeader = props => {
  return (
    <thead>
      <tr>
        <th colSpan="2" style={{ textAlign: "left" }}>
          Round {props.round}
        </th>

        <th colSpan="3" style={{ textAlign: "right" }}>
          Due:&nbsp;
          {moment(props.fixtures[0].date).format("DD-MMM-YYYY")}
        </th>
      </tr>
    </thead>
  );
};

export default FixtureTableHeader;
