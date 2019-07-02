import React, { Component } from "react";
import SubNavBar from "./SubNavBar.js";
import Header from "./Header.js";
import "../App.css";
import CreateSeasonForm from "./CreateSeasonForm.js";
import { Link } from "react-router-dom";

class SeasonsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seasons: []
    };
  }

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
        <div className="content">
          <div className="contentLeft">
            <ul>
              <li>
                <Link to="/8-ball/overview">Season 1</Link>
              </li>
            </ul>
            <button type="button" onClick={this.openPopUp}>
              + Add new season
            </button>
          </div>
          <div className="contentRight">
            <div className="form-popup" id="popup">
              <CreateSeasonForm createSeason={this.createSeason} />
              <button type="button" onClick={this.closePopUp}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SeasonsPage;
