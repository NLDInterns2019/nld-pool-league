import React from "react";

const Navigator = props => {
  var currentStyle = {
    fontWeight: "bold"
  };

  var current = this.props.current;
  const itemsToBeDisplayed = this.props.items.map(item =>
    current == item ? (
      <li>
        <a href="" style={currentStyle}>
          {item}
        </a>
      </li>
    ) : (
      <li>
        <a href="">{item}</a>
      </li>
    )
  );

  return (
    <div className="nav">
      <h2>{this.props.title}</h2>
      <ul>{itemsToBeDisplayed}</ul>
    </div>
  );
};

export default Navigator;
