import React, { Component } from "react";

class TableHeader extends Component {
  render() {
    const itemsToBeDisplayed = this.props.items.map(item => <th>{item}</th>);
    return <tr>{itemsToBeDisplayed}</tr>;
  }
}

export default TableHeader;
