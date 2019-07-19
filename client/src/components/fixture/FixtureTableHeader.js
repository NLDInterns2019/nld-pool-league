import React from "react";
import moment from 'moment';

// const headerLeftStyle = date => {
//   if (isOverdue(date)) {
//     return { color: "#f76874", textAlign: "left" };
//   } else {
//     return { textAlign: "left" };
//   }
// };

// const headerRightStyle = date => {
//   if (isOverdue(date)) {
//     return { color: "#f76874", textAlign: "right" };
//   } else {
//     return { textAlign: "right" };
//   }
// };

const FixtureTableHeader = props => {
  return (
    <thead>
      <tr>
        <th
          colSpan="2"
          // style={headerLeftStyle(new Date(parseInt(props.fixtures[0].date)))}
          style={{ textAlign: "left" }}
        >
          Round {props.round}
        </th>

        <th
          colSpan="3"
          // style={headerRightStyle(new Date(parseInt(props.fixtures[0].date)))}
          style={{ textAlign: "right" }}
        >
          Due:&nbsp;
          {moment(props.fixtures[0].date).format('DD-MMM-YYYY')}
        </th>
      </tr>
    </thead>
  );
};

export default FixtureTableHeader;
