import React, { Component } from "react";
import moment from "moment";
import auth0Client from "../../Auth";

class KittyTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showText: "Show more..."
    };

    this.noOfRows = 0;
  }

  /* toggle what is displayed when the show more/show less button is clicked */
  toggleShow = () => {
    /* if show more is clicked, change button to say show less, and display all rows */
    if (this.state.showText === "Show more...") {
      this.setState({ showText: "Show less..." });
      for (var i = 0; i < Object.keys(this.refs).length; i++) {
        this.refs["lateRow" + (i + 8)].style.display = "table-row";
      }
      /* if show less is clicked, change button to say show more, and display only top 8 rows */
    } else {
      this.setState({ showText: "Show more..." });
      for (var j = 0; j < Object.keys(this.refs).length; j++) {
        this.refs["lateRow" + (j + 8)].style.display = "none";
      }
    }
  };

  /* displays the kitty table */
  showKittyTable = () => {
    const toBeDisplayed = this.props.kitty.map((k, index) => {
      this.noOfRows = index;
      /* these rows are only displayed when show more is clicked */
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
                <div className="eight-ball-icon-20 icon-20" alt="eight ball" />
              ) : k.type === 9 ? (
                <div className="nine-ball-icon-20 icon-20" alt="nine ball" />
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
        /* these rows are displayed all the time */
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
              {/* if type is 8-ball, show an 8-ball icon */}
              {k.type === 8 ? (
                <div className="eight-ball-icon-20 icon-20" alt="eight ball" />
              ) : /* if type is 9-ball, show a 9-ball icon */
              k.type === 9 ? (
                <div className="nine-ball-icon-20 icon-20" alt="nine ball" />
              ) : (
                /* otherwise, show an error */ "type error"
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
            {/* if value is negative, add a minus sign before the shown value */}
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
    return toBeDisplayed;
  };

  render() {
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
            {this.showKittyTable()}
            {/* if the user is signed in as admin and the number of entries in the kitty statement is more than 7, display the show more button */}
            {auth0Client.isAuthenticated() &&
            auth0Client.getProfile().nickname === "admin" &&
            this.noOfRows > 7 ? (
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
