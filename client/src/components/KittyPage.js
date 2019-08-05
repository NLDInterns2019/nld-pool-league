import React from "react";
import backend from "../api/backend";
import { ToastContainer, toast } from "react-toastify";

import Header from "./nav/Header";
import SubNavBar from "./nav//SubNavBar";
import KittyTable from "./kitty/KittyTable";

import Axios from "axios";

class KittyPage extends React.Component {
  signal = Axios.CancelToken.source();
  state = {
    latestSeason: "",
    type: "",
    kitty: []
  };

  getLatestSeason = async () => {
    const latest = await backend.get("/api/89ball_season/latest", {
      params: {
        type: this.state.type
      }
    });

    this.setState({
      latestSeason: latest.data[0].seasonId
    });
  };

  getKitty = async () => {
    const kitty = await backend.get("/api/kitty");
    this.setState({ kitty: kitty.data });
  };

  componentDidMount = async () => {
    await this.setState({ type: this.props.match.params.type });
    await this.getLatestSeason();
    await this.getKitty();
  };

  render() {
    return (
      <div className="app">
        <ToastContainer />
        <Header />
        <SubNavBar
          latestSeason={this.state.latestSeason}
          type={this.state.type}
        />
        <div className="content">
          {this.state.kitty.length ? null : <h3>Nothing to see here</h3> }
          <KittyTable kitty={this.state.kitty} />
        </div>
      </div>
    );
  }
}

export default KittyPage;
