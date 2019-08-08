import React from "react";
import "../../App.css";
import { Link, matchPath, withRouter } from "react-router-dom";
import auth0Client from "../../Auth";
import HeaderNavigator from "./HeaderNavigator.js";
import Login from "./Login";

class Header extends React.Component {
  //Silent auth
  async componentDidMount() {
    if (this.props.location.pathname === '/callback') return;
    try {
      await auth0Client.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error !== 'login_required') console.log(err.error);
    }
  }

  /* SIGN OUT */
  signOut = () => {
    auth0Client.signOut();
    this.props.history.replace("/");
  };
  
  render() {
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
            <Login signOut={this.signOut} />
          </div>
        </div>
      </div>
    );
  };
  }


export default withRouter(Header);
