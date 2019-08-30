import React from "react";
import backend from "../api/backend";
import { toast } from "react-toastify";

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

  transactionForm = React.createRef();
  makeTransactionBtn = React.createRef();

  /* gets all the players that haven't paid their joining fee */
  getUnpaid = async () => {
    try {
      const unpaid = await backend.get("/api/kitty/allUnpaid", {
        cancelToken: this.signal.token
      });

      this.setState({ unpaid: unpaid.data });
    } catch (err) {
      //API CALL BEING CANCELLED
    }
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

  /* function for refreshing the kitty statement */
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
    /* if the transaction is spending money, change the value to negative */
    if (state.transactionType === "DEBIT") {
      value = value * -1;
    }
    /* register transaction in kitty */
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
    /* display success message */
    this.toastSuccess("Transaction success");
    /* refresh the kitty */
    this.getKitty();
  };

  payJoiningFee = async (name, type, seasonId) => {
    if (window.confirm("Are you sure " + name + " has paid?")) {
      /* update the 'paid' column in the league table */
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
      /* register the transaction in the kitty */
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
      /* post a message to slack saying the user has paid */
      await backend.post(
        "/api/slack/feePaid",
        {
          staffName: name,
          type: type,
          seasonId: seasonId
        },
        {
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
        }
      );
      await this.getKitty();
      await this.getUnpaid();
    }
  };

  /* posts positive feedback to the user */
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

  /* displays transaction form */
  showTransactionForm = () => {
    this.transactionForm.current.style.display = "block";
    this.makeTransactionBtn.current.style.display = "none";
  };

  /* closes transaction form */
  closeForm = () => {
    this.makeTransactionBtn.current.style.display = "block";
    this.transactionForm.current.style.display = "none";
  };

  /* function for selecting which content to show depending on the user */
  showContent = () => {
    /* if the user is signed in as admin show all content, otherwise, only show the statement */
    if (
      auth0Client.isAuthenticated() &&
      auth0Client.getProfile().nickname === "admin"
    ) {
      return (
        <div className="content">
          <div className="contentLeft">
            {/* if there are users who haven't paid their joining fee display the overdue payments table, otherwise, display a message instead */}
            {this.state.unpaid.length > 0 ? (
              <OverduePayments
                unpaid={this.state.unpaid}
                payJoiningFee={this.payJoiningFee}
              />
            ) : (
              <h3>There are no overdue payments</h3>
            )}
          </div>
          <div className="contentRight">
            <div className="kittyTableContainer">
              {/* if there have been transactions at any point, display the statement, otherwise, display a message*/}
              {this.state.kitty.length ? null : <h3>Nothing to see here</h3>}
              <KittyTable kitty={this.state.kitty} />
            </div>
            <button
              type="button"
              id="makeTransactionBtn"
              ref={this.makeTransactionBtn}
              onClick={this.showTransactionForm}
            >
              Make Transaction
            </button>
            <div
              className="transactionFormContainer"
              ref={this.transactionForm}
              style={{ display: "none" }}
            >
              <TransactionForm
                submitTransaction={this.submitTransaction}
                closeForm={this.closeForm}
              />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="content">
          <div className="kittyTableContainerNoSignIn">
            {this.state.kitty.length ? null : <h3>Nothing to see here</h3>}
            <KittyTable kitty={this.state.kitty} />
          </div>
        </div>
      );
    }
  };

  render() {
    return (
      <div className="app">
        <Header />
        <SubNavBar
          latestSeason={this.state.latestSeason}
          type={this.state.type}
        />
        <div className="kittyContent">{this.showContent()}</div>
      </div>
    );
  }
}

export default KittyPage;
