import React from "react";
import { Link } from "react-router-dom";
import backend from "../api/backend";
import Header from "./nav/Header";

class LandingPage extends React.Component {
  state = { eightLatestSeason: null, nineLatestSeason: null };

  componentDidMount = async () => {
    const eight = await backend.get("/api/89ball_season/latest", {
      params: {
        type: 8
      }
    });

    const nine = await backend.get("/api/89ball_season/latest", {
      params: {
        type: 9
      }
    });

    this.setState({
      eightLatestSeason: eight.data[0].seasonId,
      nineLatestSeason: nine.data[0].seasonId
    });
  };

  render() {
    return (
      <div className="landingPage">
        <Header />
        <div className="content">
          <div className="menu">
            <h1>Get Started</h1>
            <h2>Select a game type</h2>
            <ul>
              {this.state.eightLatestSeason === null ? (
                <li>
                  <Link to={`/8-ball/seasons`} id="eightBallLink">
                    8-Ball
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    to={`/8-ball/overview/${this.state.eightLatestSeason}`}
                    id="eightBallLink"
                  >
                    8-Ball
                  </Link>
                </li>
              )}
              {this.state.nineLatestSeason === null ? (
                <li>
                  <Link to={`/9-ball/seasons`} id="nineBallLink">
                    9-Ball
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    to={`/9-ball/overview/${this.state.nineLatestSeason}`}
                    id="nineBallLink"
                  >
                    9-Ball
                  </Link>
                </li>
              )}
              {/* <li>
                <Link to="/billiards/seasons" id="billiardsLink">
                  Billiards
                </Link>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default LandingPage;
