import React from "react";

const TableRow = props => {
  const itemsToBeDisplayed = this.props.items.map(item => (
    <td align="center">{item}</td>
  ));
  return <tr>{itemsToBeDisplayed}</tr>;
};

export default TableRow;
