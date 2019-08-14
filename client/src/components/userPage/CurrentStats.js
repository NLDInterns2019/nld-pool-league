import React from "react";
import Forms from "../league/Forms";

const displayPos = position => {
  var textToDisplay = "";
  var regexOne = /^([1-9]*(0|2|3|4|5|6|7|8|9)1)$|^1$/;
  var regexTwo = /^([1-9]*(0|2|3|4|5|6|7|8|9)2)$|^2$/;
  var regexThree = /^([1-9]*(0|2|3|4|5|6|7|8|9)3)$|^3$/;

  if (regexOne.test(position)) {
    textToDisplay = position + "st";
  } else if (regexTwo.test(position)) {
    textToDisplay = position + "nd";
  } else if (regexThree.test(position)) {
    textToDisplay = position + "rd";
  } else {
    textToDisplay = position + "th";
  }
  return textToDisplay;
};

const CurrentStats = props => {
  return (
    <div>
      <h2 style={{ textAlign: "left", marginLeft: "18px" }}>
        Latest Season (Season {props.season}):
      </h2>
      <div className="current-stats">
        <div className="current-league-pos">
          <h4>Current League Position:</h4>
          <div className="stat">
            <h4>
              {props.position >= 0 ? displayPos(props.position + 1) : "-"}
            </h4>
          </div>
        </div>
        <div className="current-form">
          <h4>Form:</h4>
          <Forms form={props.player ? props.player.form : []} />
        </div>
      </div>
    </div>
  );
};

export default CurrentStats;
