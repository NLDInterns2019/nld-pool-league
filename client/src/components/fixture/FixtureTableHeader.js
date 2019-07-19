import React from "react";

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
