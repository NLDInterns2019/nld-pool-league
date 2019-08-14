import React from "react";
import { withRouter } from "react-router-dom";
import auth0Client from "../../Auth";

const Login = props => {
  return (
    <div className="nav">
      {/* <Link id="loginBtnLink"> */}
      {!auth0Client.isAuthenticated() && (
        <button
          id="loginBtn"
          className="btn btn-dark"
          onClick={auth0Client.signIn}
        >
          Sign In
        </button>
      )}
      {auth0Client.isAuthenticated() && (
        <div>
          {auth0Client.getProfile().nickname}
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
      {/* </Link> */}
    </div>
  );
};

export default withRouter(Login);
