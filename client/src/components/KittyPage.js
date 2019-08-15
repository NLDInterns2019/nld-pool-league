import React from "react";
import backend from "../api/backend";
import { ToastContainer, toast } from "react-toastify";

import Header from "./nav/Header";
import SubNavBar from "./nav//SubNavBar";
import TransactionForm from "./kitty/TransactionForm";
import KittyTable from "./kitty/KittyTable";
import OverduePayments from "./kitty/OverduePayments";

import Axios from "axios";
import auth0Client from "../Auth";

class KittyPage extends React.Component {
  signal = Axios.CancelToken.source();
  state = {
    latestSeason: "",
    type: "",
    kitty: [],
    unpaid: []
  };

  getUnpaid = async () => {
    const unpaid = await backend.get("/api/kitty/allUnpaid");

    this.setState({ unpaid: unpaid.data });
  };

  getLatestSeason = async () => {
    try {
      const latest = await backend.get("/api/89ball_season/latest", {
        cancelToken: this.signal.token,
        params: {
          type: this.state.type
        }
      });

      this.setState({
        latestSeason: latest.data[0].seasonId
      });
    } catch (err) {
      //API CALL BEING CANCELED
    }
  };

  getKitty = async () => {
    try {
      const kitty = await backend.get("/api/kitty", {
        cancelToken: this.signal.token
      });
      this.setState({ kitty: kitty.data });
    } catch (err) {
      //API CALL BEING CANCELED
    }
  };

  componentDidMount = async () => {
    await this.setState({ type: this.props.match.params.type });
    await this.getLatestSeason();
    await this.getKitty();
    await this.getUnpaid();
  };

  componentWillUnmount() {
    this.signal.cancel("");
  }

  submitTransaction = async state => {
    let value = parseFloat(state.value);
    if (state.transactionType === "DEBIT") {
      value = value * -1;
    }
    await backend.post(
      "/api/kitty/transaction",
      {
        type: parseInt(state.type),
        seasonId: parseInt(state.seasonId),
        staffName: auth0Client.getProfile().nickname,
        description: state.description,
        value: value
      },
      {
        headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
      }
    );

    this.toastSuccess("Transaction success");

    this.getKitty();
  };

  payJoiningFee = async (name, type, seasonId) => {
    if (window.confirm("Are you sure " + name + " has paid?")) {
      await backend.put(
        "/api/89ball_league/paid",
        {
          type: type,
          seasonId: seasonId,
          staffName: name
        },
        {
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
        }
      );

      await backend.post(
        "/api/kitty/transaction",
        {
          type: type,
          seasonId: seasonId,
          staffName: name,
          description: `Joining fee`,
          //JOINING FEE
          value: 1
        },
        {
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
        }
      );

      await this.getKitty();
      await this.getUnpaid();
    }
  };

  toastSuccess = message => {
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
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
        <div className="kittyContent">
          <div className="content">
            <div className="contentLeft">
              {auth0Client.isAuthenticated() &&
              auth0Client.getProfile().nickname === "admin" ? (
                <OverduePayments
                  unpaid={this.state.unpaid}
                  payJoiningFee={this.payJoiningFee}
                />
              ) : null}
            </div>
            <div className="contentRight">
              <div className="kittyTableContainer">
                {this.state.kitty.length ? null : <h3>Nothing to see here</h3>}
                <KittyTable kitty={this.state.kitty} />
              </div>
              {auth0Client.isAuthenticated() &&
              auth0Client.getProfile().nickname === "admin" ? (
                <TransactionForm submitTransaction={this.submitTransaction} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default KittyPage;
