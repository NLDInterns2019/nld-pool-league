import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import auth0Client from "./Auth";

class Callback extends Component {
  async componentDidMount() {
    auth0Client
      .handleAuthentication()
      .then(res => this.props.history.replace(res));
  }

  render() {
    return <p>Loading profile...</p>;
  }
}

export default withRouter(Callback);
