import React from "react";
import "../../App.css";
import { Link, matchPath, withRouter } from "react-router-dom";
import auth0Client from "../../Auth";
import HeaderNavigator from "./HeaderNavigator.js";
import Login from "./Login";

const Header = () => {
  /* SIGN OUT */
  const signOut = () => {
    auth0Client.signOut();
    this.props.history.replace("/");
  };
  
    return (
      <div className="header" id="headerBox">
        <div className="headerLeft">
          <Link to="/">POOL MANAGER</Link>
        </div>
        <div className="headerRight">
          <div className="headerRight-left">
            {matchPath(window.location.pathname, { path: "/", exact: true }) ? (
              <div />
            ) : (
              <HeaderNavigator />
            )}
          </div>
          <div className="headerRight-right">
            <Login signOut={signOut} />
          </div>
        </div>
      </div>
    );
  }


export default withRouter(Header);
