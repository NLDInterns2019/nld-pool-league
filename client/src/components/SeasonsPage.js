import React, { Component } from "react";
import SubNavBar from "./SubNavBar.js";
import Header from "./Header.js";
import Popup from "./Popup.js";
import "../App.css";

class SeasonsPage extends Component {
  openPopUp() {
    document.getElementById("popup").style.display = "block";
  }

  closePopUp() {
    document.getElementById("popup").style.display = "none";
  }

  render() {
    return (
      <div className="seasons">
        <Header />
        <SubNavBar current="Seasons" />
        <Popup onClose={this.closePopUp} />
        <div className="content">
          <button type="button" onClick={this.openPopUp}>
            + Add new season
          </button>
        </div>
      </div>
    );
  }
}

export default SeasonsPage;
