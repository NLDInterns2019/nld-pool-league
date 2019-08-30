import React, { Component } from "react";
import { Link } from "react-router-dom";
import auth0Client from "../../Auth";

class Collapsible extends Component {
  constructor() {
    super();
    this.collapsible = React.createRef();
  }

  toggleMenu() {
    if (this.collapsible.current.style.display === "none") {
      this.collapsible.current.style.display = "block";
    } else {
      this.collapsible.current.style.display = "none";
    }
  }

  render() {
    return (
      <div className="itemMenu">
        <div
          className="menu-icon icon-32"
          alt="menu"
          onClick={this.toggleMenu.bind(this)}
        />
        <ul
          className="collapsible"
          ref={this.collapsible}
          style={{ display: "none" }}
        >
          <li>
            {this.props.type !== "Billiards" ? (
              <Link
                to={`/${this.props.type}-ball/seasons`}
                id="seasonsLink"
                style={this.props.seasonsCurrentStyle}
              >
                All Seasons
              </Link>
            ) : (
              <Link
                to={`/${this.props.type}/seasons`}
                id="seasonsLink"
                style={this.props.seasonsCurrentStyle}
              >
                All Seasons
              </Link>
            )}
          </li>
          {this.props.type !== "Billiards"
            ? this.props.seasonFixtureLink(`${this.props.type}-ball`)
            : this.props.seasonFixtureLink(`Billiards`)}
          <li>
            {!auth0Client.isAuthenticated() ? null : this.props.type !==
              "Billiards" ? (
              <Link
                to={`/${this.props.type}-ball/dashboard`}
                style={this.props.dashboardCurrentStyle}
                id="seasonsLink"
              >
                My Dashboard
              </Link>
            ) : (
              <Link
                to={`/${this.props.type}/dashboard`}
                style={this.props.dashboardCurrentStyle}
                id="seasonsLink"
              >
                My Dashboard
              </Link>
            )}
          </li>
        </ul>
      </div>
    );
  }
}

export default Collapsible;
