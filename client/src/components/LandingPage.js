import React from "react";
import { Link } from "react-router-dom";
import backend from "../api/backend";
import Header from "./nav/Header";

class LandingPage extends React.Component {
  state = { eightLatestSeason: null, nineLatestSeason: null };

  /* get the latest seasons from both 8-ball and 9-ball */
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
              {/* if there are no 8-ball seasons, the link takes the user to 'All Seasons' when clicked, otherwise, it takes the user to 'Current Season' */}
              {this.state.eightLatestSeason === null ? (
                <li>
                  <Link
                    to={`/8-ball/seasons`}
                    id="eightBallLink"
                    className="landingPageLink"
                  >
                    <div className="eight-ball-icon icon-40" alt="eight ball" />
                    8-Ball
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    to={`/8-ball/overview/${this.state.eightLatestSeason}`}
                    id="eightBallLink"
                    className="landingPageLink"
                  >
                    <div className="eight-ball-icon icon-40" alt="eight ball" />
                    8-Ball
                  </Link>
                </li>
              )}
              {/* if there are no 9-ball seasons, the link takes the user to 'All Seasons' when clicked, otherwise, it takes the user to 'Current Season' */}
              {this.state.nineLatestSeason === null ? (
                <li>
                  <Link
                    to={`/9-ball/seasons`}
                    id="nineBallLink"
                    className="landingPageLink"
                  >
                    <div className="nine-ball-icon icon-40" alt="nine ball" />
                    9-Ball
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    to={`/9-ball/overview/${this.state.nineLatestSeason}`}
                    id="nineBallLink"
                    className="landingPageLink"
                  >
                    <div className="nine-ball-icon icon-40" alt="nine ball" />
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
