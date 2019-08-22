import React from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import auth0Client from "../Auth";
import backend from "../api/backend";
import SubNavBar from "./nav/SubNavBar.js";
import Header from "./nav/Header.js";
import "../App.css";
import HoFTable from "./halloffame/HoFTable";

class HoFPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      latestSeason: "",
      HoF8: [],
      HoF9: []
    };
  }

  signal = Axios.CancelToken.source();

  getHOF = async () => {
    try {
      const HoF8 = await backend.get("/api/hall_of_fame?type=8", {
        cancelToken: this.signal.token
      });

      this.setState({ HoF8: HoF8.data });

      const HoF9 = await backend.get("/api/hall_of_fame?type=9", {
        cancelToken: this.signal.token
      });

      this.setState({ HoF9: HoF9.data });
    } catch (err) {
      //API CALL BEING CANCELED
    }
  };

  getLatestSeason = async () => {
    const latest = await backend.get("/api/89ball_season/latest", {
      params: {
        type: this.state.type
      }
    });

    this.setState({
      latestSeason: latest.data[0].seasonId
    });
  };

  sendHallOfFameUpdateSlackMessage = async (type, playerName, achievement) => {
    await backend
      .post(
        "/api/slack/hallOfFameUpdate",
        {
          type: type,
          player: playerName,
          achievement: achievement
        },
        {
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
        }
      )
      .then(console.log("posted"));
  };

  componentDidMount = async () => {
    await this.setState({ type: this.props.match.params.type });
    await this.getLatestSeason();
    // when component mounted, start a GET request
    // to specified URL

    //GET
    await this.getHOF();
  };

  componentWillUnmount() {
    this.signal.cancel("");
  }

  render() {
    return (
      <div id="seasons">
        <Header />
        <SubNavBar
          latestSeason={this.state.latestSeason}
          type={this.state.type}
        />
        <div className="content">
          <div className="contentLeft">
            <div className="hallOfFameTitleContainer">
              <span className="eight-ball-icon" alt="eight ball" />
              <h3>8-Ball</h3>
              <span className="eight-ball-icon" alt="eight ball" />
            </div>
            <HoFTable players={this.state.HoF8} />
          </div>
          <div className="contentRight">
            <div className="hallOfFameTitleContainer">
              <span className="nine-ball-icon" alt="nine ball" />
              <h3>9-Ball</h3>
              <span className="nine-ball-icon" alt="nine ball" />
            </div>
            <HoFTable players={this.state.HoF9} />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(HoFPage);
