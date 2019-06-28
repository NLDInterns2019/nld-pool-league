import React, { Component } from "react";

class TableRow extends Component {
  render() {
    const itemsToBeDisplayed = this.props.items.map(item => (
      <td align="center">{item}</td>
    ));
    return <tr>{itemsToBeDisplayed}</tr>;
  }
}

export default TableRow;
