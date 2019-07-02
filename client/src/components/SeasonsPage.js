import React, { Component } from "react";
import axios from "axios";

import SubNavBar from "./SubNavBar.js";
import Header from "./Header.js";
import "../App.css";
import CreateSeasonForm from "./CreateSeasonForm.js";
import SeasonsList from "./SeasonsList.js";

class SeasonsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seasons: []
    };
  }

  getSeasonsList = async () => {
    const response = await axios.get(
      "http://nldpoolleaguebackend.azurewebsites.net/api/8ball_season"
    );
    this.setState({ seasons: response.data });
  };

  componentDidMount() {
    this.getSeasonsList();
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
            <div className="seasonsListContainer">
              <SeasonsList seasons={this.state.seasons} />
              <br />
              <button type="button" onClick={this.openPopUp}>
                + Add new season
              </button>
            </div>
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
