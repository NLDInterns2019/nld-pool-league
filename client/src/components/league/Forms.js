import React from "react";

const Forms = ({form}) => {
    let formsToBeDisplayed = [];
    if (!form || form.length === 0) {
      form = "-----";
    }
    for (let i = 0; i < form.length; i++) {
      if (form.charAt(i) === "W") {
        formsToBeDisplayed = formsToBeDisplayed.concat(
          <div key={i} className="form-item">
            <div className="win-icon" alt="win" />
          </div>
        );
      }
      if (form.charAt(i) === "D") {
        formsToBeDisplayed = formsToBeDisplayed.concat(
          <div key={i} className="form-item">
            <div className="draw-icon" alt="draw" />
          </div>
        );
      }
      if (form.charAt(i) === "L") {
        formsToBeDisplayed = formsToBeDisplayed.concat(
          <div key={i} className="form-item">
            <div className="loss-icon" alt="loss" />
          </div>
        );
      }
      if (form.charAt(i) === "-") {
        formsToBeDisplayed = formsToBeDisplayed.concat(
          <div key={i} className="form-item">
            <div className="no-game-icon" alt="no game" />
          </div>
        );
      }
    }
    return formsToBeDisplayed;
}

export default Forms;