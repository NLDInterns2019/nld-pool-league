import React, { Component } from "react";
import moment from "moment";
import auth0Client from "../../Auth";

class KittyTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showText: "Show more...",
      noOfRows: 0
    };
  }

  toggleShow = () => {
    if (this.state.showText === "Show more...") {
      this.setState({ showText: "Show less..." });
      for (var i = 0; i < Object.keys(this.refs).length; i++) {
        this.refs["lateRow" + (i + 8)].style.display = "table-row";
      }
    } else {
      this.setState({ showText: "Show more..." });
      for (var i = 0; i < Object.keys(this.refs).length; i++) {
        this.refs["lateRow" + (i + 8)].style.display = "none";
      }
    }
  };

  render() {
    const toBeDisplayed = this.props.kitty.map((k, index) => {
      this.state.noOfRows = index;
      if (index > 7) {
        return (
          <tr key={k.id} className="lateRow" ref={"lateRow" + index}>
            <td>{k.id}</td>
            <td
              className={
                auth0Client.isAuthenticated() &&
                auth0Client.getProfile().nickname === "admin"
                  ? "kittyTableDate"
                  : null
              }
            >
              {moment(k.date).format("DD-MM-YY")}
            </td>
            <td>
              {k.type === 8 ? (
                <div className="eight-ball-icon-20" alt="eight ball" />
              ) : k.type === 9 ? (
                <div className="nine-ball-icon-20" alt="nine ball" />
              ) : (
                "type error"
              )}
            </td>
            <td>{k.seasonId}</td>
            <td>{k.staffName}</td>
            <td
              className={
                auth0Client.isAuthenticated() &&
                auth0Client.getProfile().nickname === "admin"
                  ? "kittyTableDesc"
                  : null
              }
            >
              {k.description}
            </td>
            {k.value < 0 ? (
              <td style={{ color: "Red" }} align="center">
                -£{Math.abs(k.value).toFixed(2)}
              </td>
            ) : (
              <td style={{ color: "Green" }} align="center">
                +£{k.value.toFixed(2)}
              </td>
            )}
          </tr>
        );
      } else {
        return (
          <tr key={k.id}>
            <td>{k.id}</td>
            <td
              className={
                auth0Client.isAuthenticated() &&
                auth0Client.getProfile().nickname === "admin"
                  ? "kittyTableDate"
                  : null
              }
            >
              {moment(k.date).format("DD-MM-YY")}
            </td>
            <td>
              {k.type === 8 ? (
                <div className="eight-ball-icon-20" alt="eight ball" />
              ) : k.type === 9 ? (
                <div className="nine-ball-icon-20" alt="nine ball" />
              ) : (
                "type error"
              )}
            </td>
            <td>{k.seasonId}</td>
            <td>{k.staffName}</td>
            <td
              className={
                auth0Client.isAuthenticated() &&
                auth0Client.getProfile().nickname === "admin"
                  ? "kittyTableDesc"
                  : null
              }
            >
              {k.description}
            </td>
            {k.value < 0 ? (
              <td style={{ color: "Red" }} align="center">
                -£{Math.abs(k.value).toFixed(2)}
              </td>
            ) : (
              <td style={{ color: "Green" }} align="center">
                +£{k.value.toFixed(2)}
              </td>
            )}
          </tr>
        );
      }
    });

    if (this.props.kitty.length === 0) {
      return null;
    }
    return (
      <div>
        <div className="kittyTitle">
          <h3>Statement:</h3>

          <h3 id="balanceTracker">
            {this.props.kitty.length
              ? "Balance: £" + this.props.kitty[0].total.toFixed(2)
              : null}
          </h3>
        </div>

        <table
          cellSpacing="0"
          className={
            auth0Client.isAuthenticated() &&
            auth0Client.getProfile().nickname === "admin"
              ? "kittyTable"
              : "kittyTableNoSignIn"
          }
        >
          <thead>
            <tr>
              <th>#</th>
              <th
                className={
                  auth0Client.isAuthenticated() &&
                  auth0Client.getProfile().nickname === "admin"
                    ? "kittyTableDate"
                    : null
                }
              >
                Date
              </th>
              <th>Type</th>
              <th>Season</th>
              <th>Name</th>
              <th
                className={
                  auth0Client.isAuthenticated() &&
                  auth0Client.getProfile().nickname === "admin"
                    ? "kittyTableDesc"
                    : null
                }
              >
                Description
              </th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {toBeDisplayed}
            {auth0Client.isAuthenticated() &&
            auth0Client.getProfile().nickname === "admin" &&
            this.state.noOfRows > 7 ? (
              <tr className="showRow">
                <td
                  colSpan="2"
                  style={{ width: "inherit" }}
                  onClick={this.toggleShow}
                >
                  {this.state.showText}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    );
  }
}

export default KittyTable;
