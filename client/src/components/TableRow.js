import React from "react";

const TableRow = props => {
  const itemsToBeDisplayed = props.items.map(item => (
    <td align="center">{item}</td>
  ));
  return <tr>{itemsToBeDisplayed}</tr>;
};

export default TableRow;
