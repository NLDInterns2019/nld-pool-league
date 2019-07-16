import React from "react";
import "../../App.css";
import { Link, matchPath, withRouter } from "react-router-dom";
import auth0Client from "../../Auth";
import HeaderNavigator from "./HeaderNavigator.js";

const Header = (props) => {
  var currentPath = window.location.pathname;
  /* SIGN OUT */
  const signOut = () => {
    auth0Client.signOut();
    props.history.replace("/");
  };

  return (
    <div className="header" id="headerBox">
      <div className="headerLeft">
        <Link to="/">POOL MANAGER</Link>
      </div>
      <div className="headerRight">
        {matchPath(currentPath, { path: "/", exact: true }) ? (
          <div />
        ) : (
          <HeaderNavigator signOut={signOut} />
        )}
      </div>
    </div>
  );
};

export default withRouter(Header);
