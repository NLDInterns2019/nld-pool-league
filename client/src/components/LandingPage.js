import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

const LandingPage = () => {
  return (
    <div className="landingPage">
      <Header />
      <div className="content">
        <div className="menu">
          <h1>Get Started</h1>
          <h2>Select a variant</h2>
          <ul>
            <li>
              <Link to="/8-ball/seasons" id="eightBallLink">
                8-Ball
              </Link>
            </li>
            <li>
              <Link to="/9-ball/seasons" id="nineBallLink">
                9-Ball
              </Link>
            </li>
            <li>
              <Link to="/billiards/seasons" id="billiardsLink">
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
