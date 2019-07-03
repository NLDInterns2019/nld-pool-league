import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

const LandingPage = () => {
  return (
    <div className="landingPage">
      <Header />
      <div className="content">
        <h1>Get Started</h1>
        <h2>Select a variant</h2>
        <ul>
          <li>
            <Link to="/8-ball/overview">8-Ball</Link>
          </li>
          <li>
            <Link to="/8-ball/overview">9-Ball</Link>
          </li>
          <li>
            <Link to="/8-ball/overview">Billiards</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LandingPage;
