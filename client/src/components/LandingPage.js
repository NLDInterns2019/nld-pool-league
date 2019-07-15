import React from "react";
import { Link } from "react-router-dom";
import Header from "./nav/Header";

const LandingPage = () => {
  return (
    <div className="landingPage">
      <Header />
      <div className="content">
        <div className="menu">
          <h1>Get Started</h1>
          <h2>Select a game type</h2>
          <ul>
            <li>
              <Link
                to={{
                  pathname: "/8-ball/seasons",
                  state: {
                    type: 8
                  }
                }}
                id="eightBallLink"
              >
                8-Ball
              </Link>
            </li>
            <li>
              <Link
                to={{
                  pathname: "/9-ball/seasons",
                  state: {
                    type: 9
                  }
                }}
                id="nineBallLink"
              >
                9-Ball
              </Link>
            </li>
            <li>
              <Link
                to={{
                  pathname: "/billiards/seasons",
                  state: {}
                }}
                id="billiardsLink"
              >
                Billiards
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
