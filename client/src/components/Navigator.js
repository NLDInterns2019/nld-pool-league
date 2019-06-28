import React, { Component } from "react";

class Navigator extends Component {
  render() {
    const itemsToBeDisplayed = this.props.items.map(item => (
      <li>
        <a href="">{item}</a>
      </li>
    ));

    return (
      <div className="nav">
        <h2>{this.props.title}</h2>
        <ul>{itemsToBeDisplayed}</ul>
      </div>
    );
  }
}

export default Navigator;
