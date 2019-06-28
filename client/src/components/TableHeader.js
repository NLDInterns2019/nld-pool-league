import React from "react";

const TableHeader = props => {
  const itemsToBeDisplayed = props.items.map(item => <th>{item}</th>);
  return <tr>{itemsToBeDisplayed}</tr>;
};

export default TableHeader;
