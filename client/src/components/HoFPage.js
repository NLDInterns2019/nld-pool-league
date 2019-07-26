import React from "react";
import { withRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
      seasons: [],
      latestSeason: null,
      players: []
    };
  }

  componentDidMount = async () => {
    // when component mounted, start a GET request
    // to specified URL
    const result = await backend.get("/api/hall_of_fame", {
      params: {
        type: 8
      }
    });

    this.setState({ players: result.data });

    const HoF9 = await backend.get("/api/hall_of_fame", {
      params: {
        type: 8
      }
    });

    this.setState({ HoF9: HoF9.data });
  };

  createHoF = async state => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth0Client.getIdToken()}`
      };

      await backend.post(
        "/api/hall_of_fame/calculate",
        {
          type: parseInt(this.state.type)
        },
        {
          headers: headers
        }
      );
      
    } catch (e) {
      if (e.response.status === 401) {
        this.toastUnauthorised();
      }
    }
  };

  toastSuccess = message => {
    toast.success(`✅ ${message}!`, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  render() {
    return (
      <div id="seasons">
        <ToastContainer />
        <Header />
        <SubNavBar
          latestSeason={this.state.latestSeason}
          type={this.state.type}
        />
        <div className="content">
          <div className="HoFLeagueContainer">
            <div className="HoFTitleContainer">
              <h3>Hall of Fame</h3>
              <br />
            </div>
            <div className="hof8Ball">
              <h3>
                <span role="img" aria-label="8-ball">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  🎱
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;8-Ball&nbsp;&nbsp;&nbsp;&nbsp;
                <span role="img" aria-label="8-ball">
                  🎱
                </span>
              </h3>
              <HoFTable players={this.state.players} />
            </div>
            <div className="hof9Ball">
              <h3>
                <span role="img" aria-label="8-ball">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🎱
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;9-Ball&nbsp;&nbsp;&nbsp;&nbsp;
                <span role="img" aria-label="8-ball">
                  🎱
                </span>
              </h3>
              <HoFTable HoF9={this.state.HoF9} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(HoFPage);
