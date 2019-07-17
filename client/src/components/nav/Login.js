import React from "react";
import { Link, withRouter } from "react-router-dom";
import auth0Client from "../../Auth";

const Login = props => {
  return (
    <div className="nav">
      <ul>
        <li>
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
        </li>
      </ul>
    </div>
  );
};

export default withRouter(Login);
