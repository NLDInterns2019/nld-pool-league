import React from "react";
import { withRouter, Link } from "react-router-dom";
import auth0Client from "../../Auth";

const Login = props => {
  return (
    <div className="nav">
      <Link>
        {!auth0Client.isAuthenticated() && (
          <button className="btn btn-dark" onClick={auth0Client.signIn}>
            Sign In
          </button>
        )}
        {auth0Client.isAuthenticated() && (
          <div>
            <button
              id="signout"
              className="btn btn-dark"
              onClick={() => {
                props.signOut();
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </Link>
    </div>
  );
};

export default withRouter(Login);
