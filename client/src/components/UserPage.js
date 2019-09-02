import React from "react";
import backend from "../api/backend";
import auth0Client from "../Auth";
import { toast } from "react-toastify";
import Axios from "axios";
import { find, findIndex, orderBy, uniqBy } from "lodash";

import Header from "./nav/Header";
import SubNavBar from "./nav//SubNavBar";
import SeasonAccordion from "./userPage/SeasonAccordion";
import UpcomingMatch from "./userPage/UpcomingMatch";

import CurrentStats from "./userPage/CurrentStats";
import AllTimeStats from "./userPage/AllTimeStats";
import CanvasJSReact from "../assets/canvasjs.react";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class UserPage extends React.Component {
  signal = Axios.CancelToken.source();
  state = {
    player: " ",
    seasons8: [],
    positions8: [],
    seasons9: [],
    positions9: [],
    hofStat8: [],
    hofStat9: [],
    players8: [],
    players9: [],
    fixtures: [],
    latestSeason8: "",
    latestSeason9: "",
    type: "",
    groupCount: 0,
    bookings8: [],
    bookings9: [],
    unpaid: [],
    intialAuthentication: false
  };

  /* function for setting the values and datapoints in the graphs */
  prepareChart = (positions, seasonIds) => {
    var options = {
      width: 500,
      height: 250,
      axisX: {
        title: "Season",
        interval:
          seasonIds.length > 14 && seasonIds.length < 30
            ? 2
            : seasonIds.length < 15
            ? 1
            : 3
      },
      axisY: {
        title: "Finishing Position",
        reversed: true,
        interval: 1,
        gridColor: "#eeeeee",
        viewportMinimum: 0.25
      },
      data: [
        {
          type: "line",
          toolTipContent: "Season {x}: {y}",
          lineColor: "#127e5c",
          color: "#127e5c",
          dataPoints: []
        }
      ]
    };

    for (var i = 0; i < positions.length; i++) {
      options.data[0].dataPoints.push({ x: seasonIds[i], y: positions[i] });
    }

    return options;
  };

  getSeasons = async () => {
    try {
      /* gets 8-ball position history for current player */
      const eight = await backend.get("/api/position_history/", {
        cancelToken: this.signal.token,
        params: {
          type: 8,
          staffName: this.state.player
        }
      });
      /* sets 8-ball position history */
      this.setState({
        seasons8: orderBy(
          uniqBy(eight.data, "seasonId"),
          ["seasonId"],
          ["asc"]
        ).map(season => season.seasonId),
        positions8: orderBy(
          uniqBy(eight.data, "seasonId"),
          ["seasonId"],
          ["asc"]
        ).map(player => player.position)
      });
      /* gets 9-ball position history for current player */
      const nine = await backend.get("/api/position_history/", {
        cancelToken: this.signal.token,
        params: {
          type: 9,
          staffName: this.state.player
        }
      });
      /* sets 9-ball position history */
      this.setState({
        seasons9: orderBy(
          uniqBy(nine.data, "seasonId"),
          ["seasonId"],
          ["asc"]
        ).map(season => season.seasonId),
        positions9: orderBy(
          uniqBy(nine.data, "seasonId"),
          ["seasonId"],
          ["asc"]
        ).map(player => player.position)
      });
    } catch (err) {
      //API CALL BEING CANCELED
    }
  };

  /* gets most recent seasons from 8-ball and 9-ball */
  getLatestSeason = async () => {
    try {
      const latest8 = await backend.get("/api/89ball_season/latest", {
        cancelToken: this.signal.token,
        params: {
          type: 8
        }
      });

      const latest9 = await backend.get("/api/89ball_season/latest", {
        cancelToken: this.signal.token,
        params: {
          type: 9
        }
      });

      this.setState({
        latestSeason8: latest8.data[0].seasonId,
        latestSeason9: latest9.data[0].seasonId
      });
    } catch (err) {}
  };

  /* gets the upcoming booked matches from database */
  getBookings = async () => {
    try {
      const bookings = await backend.get("/api/booking/upcoming", {
        cancelToken: this.signal.token,
        params: {
          staffName: this.state.player
        }
      });

      /* separates bookings into 8-ball and 9-ball */
      this.setState({
        bookings8: bookings.data.filter(booking => booking.type === 8),
        bookings9: bookings.data.filter(booking => booking.type === 9)
      });
    } catch (err) {
      //API CALL BEING CANCELLED
    }
  };

  /* gets all seasons the current player has not paid a joining fee for */
  getUnpaidSeasons = async () => {
    try {
      const unpaid = await backend.get("/api/kitty/unpaid", {
        cancelToken: this.signal.token,
        params: {
          staffName: this.state.player
        }
      });
      this.setState({ unpaid: unpaid.data });
    } catch (err) {
      //API CALL BEING CANCELLED
    }
  };

  /* gets players from most recent season from both 8-ball and 9-ball */
  getPlayers = async () => {
    /* if there is an 8-ball season, get the players from the most recent season */
    if (this.state.latestSeason8 !== null && this.state.latestSeason8 !== "") {
      try {
        const eight = await backend.get(
          "/api/89ball_league/" + this.state.latestSeason8,
          {
            cancelToken: this.signal.token,
            params: {
              type: 8
            }
          }
        );
        this.setState({ players8: eight.data });
      } catch (err) {
        //API CALL BEING CANCELLED
      }
    }
    /* if there is a 9-ball season, get the players from the most recent season */
    if (this.state.latestSeason9 !== null && this.state.latestSeason9 !== "") {
      try {
        const nine = await backend.get(
          "/api/89ball_league/" + this.state.latestSeason9,
          {
            cancelToken: this.signal.token,
            params: {
              type: 9
            }
          }
        );
        this.setState({ players9: nine.data });
      } catch (err) {
        //API CALL BEING CANCELLED
      }
    }
  };

  /* get player stats for 8-ball and 9-ball */
  getPlayerStat = async () => {
    try {
      /* gets hall of fame stats for current player in 8-ball */
      const eight = await backend.get("/api/hall_of_fame", {
        cancelToken: this.signal.token,
        params: {
          type: 8,
          staffName: this.state.player
        }
      });
      this.setState({ hofStat8: eight.data[0] });
    } catch (err) {
      //API CALL BEING CANCELLED
    }

    try {
      /* gets hall of fame stats for current player in 9-ball */
      const nine = await backend.get("/api/hall_of_fame", {
        cancelToken: this.signal.token,
        params: {
          staffName: this.state.player,
          type: 9
        }
      });
      this.setState({ hofStat9: nine.data[0] });
    } catch (err) {
      //API CALL BEING CANCELLED
    }
  };

  componentDidMount = async () => {
    await this.setState({ type: this.props.match.params.type });
    await this.getLatestSeason();
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.intialAuthentication === false &&
      auth0Client.isAuthenticated()
    ) {
      this.setState(
        {
          player: auth0Client.getProfile().nickname,
          intialAuthentication: true
        },
        () => {
          this.getUnpaidSeasons();
          this.getBookings();
          this.getPlayers();
          this.getPlayerStat();
          this.getSeasons();
        }
      );
    }

    if (
      auth0Client.isAuthenticated() &&
      (this.state.latestSeason8 !== prevState.latestSeason8 ||
        this.state.latestSeason9 !== prevState.latestSeason9)
    ) {
      this.getUnpaidSeasons();
      this.getPlayers();
    }
  }

  componentWillUnmount() {
    this.signal.cancel("");
  }

  /* toast for when the user isn't signed in */
  toastUnauthorised = () => {
    toast.error(
      <div className="toast">
        <div className="no-entry-icon icon-24" alt="no entry" />
        <p>Unauthorised! Please log in</p>
      </div>,
      {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      }
    );
  };

  /* toast for when an error occurs */
  toastError = message => {
    toast.error(message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  /* toast for when the action succeeds */
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

  /* gets the data for displaying in the red banner at the top of the user page saying which seasons the current players owes money for */
  unpaidEightBallMessage = () => {
    const unpaidSeasons = this.state.unpaid;
    const unpaidEightBallSeasons = [];

    /* gets all the 8-ball season ids of the seasons the player hasn't paid for */
    for (var i = unpaidSeasons.length - 1; i >= 0; i--) {
      if (unpaidSeasons[i].type === 8) {
        unpaidEightBallSeasons.push(unpaidSeasons[i]);
      }
    }
    if (unpaidEightBallSeasons.length > 0) {
      return (
        /* display a message to the user in a red box saying which 8-ball seasons they owe money for and the total amount */
        <div className="unpaid-seasons-message">
          <div className="unpaid-season-title">
            <div className="eight-ball-icon icon-40" alt="eight ball" />
            <h3>Payments Due:</h3>
          </div>
          <div className="unpaid-seasons-list">
            <div className="unpaid-eight-ball">
              {unpaidEightBallSeasons.map(season => {
                return (
                  <div
                    key={season.seasonId + season.type}
                    className="unpaid-item"
                  >
                    Season {season.seasonId}
                  </div>
                );
              })}
            </div>
          </div>
          {/* this is currently just the number of seasons but if the joining fee changed, this would also need to be changed accordingly */}
          <div className="unpaid-total">
            Total: £{unpaidEightBallSeasons.length}.00
          </div>
        </div>
      );
    } else {
      return;
    }
  };

  /* gets the data for displaying in the red banner at the top of the user page saying which seasons the current players owes money for */
  unpaidNineBallMessage = () => {
    const unpaidSeasons = this.state.unpaid;
    const unpaidNineBallSeasons = [];

    /* gets all the 9-ball season ids of the seasons the player hasn't paid for */
    for (var i = unpaidSeasons.length - 1; i >= 0; i--) {
      if (unpaidSeasons[i].type === 9) {
        unpaidNineBallSeasons.push(unpaidSeasons[i]);
      }
    }
    if (unpaidNineBallSeasons.length > 0) {
      return (
        /* display a message to the user in a red box saying which 9-ball seasons they owe money for and the total amount */
        <div className="unpaid-seasons-message">
          <div className="unpaid-season-title">
            <div className="nine-ball-icon icon-40" alt="nine ball" />
            <h3>Payments Due:</h3>
          </div>
          <div className="unpaid-seasons-list">
            <div className="unpaid-nine-ball">
              {unpaidNineBallSeasons.map(season => {
                return (
                  <div
                    key={season.seasonId + season.type}
                    className="unpaid-item"
                  >
                    Season {season.seasonId}
                  </div>
                );
              })}
            </div>
          </div>
          {/* this is currently just the number of seasons but if the joining fee changed, this would also need to be changed accordingly */}
          <div className="unpaid-total">
            Total: £{unpaidNineBallSeasons.length}.00
          </div>
        </div>
      );
    } else {
      return;
    }
  };

  render() {
    return (
      <div className="app">
        <Header />
        <SubNavBar
          latestSeason={
            this.state.type === "8"
              ? this.state.latestSeason8
              : this.state.latestSeason9
          }
          type={this.state.type}
        />
        {!auth0Client.isAuthenticated() ? (
          /* displays if the user isn't signed in */
          <h3 className="error" style={{ textAlign: "center" }}>
            You are not logged in
          </h3>
        ) : (
          /* displays if the user is signed in */
          <div style={{ textAlign: "center" }}>
            {/* displays a welcome back message and the seasons they owe money for */}
            <div className="player-info">
              <h3>
                Welcome back <strong>{this.state.player.toUpperCase()}</strong>
              </h3>
              {this.unpaidEightBallMessage()}
              {this.unpaidNineBallMessage()}
            </div>
            <div className="content">
              {/* 8-ball summary section that includes current league position, current form, some all-time stats,
              a graph showing previous league positions, fixtures that are due in the next two weeks, and upcoming bookings */}
              <div className="contentLeft">
                <div className="summary-title">
                  <div className="eight-ball-icon icon-40" alt="eight ball" />
                  <h3>8-Ball Summary</h3>
                  <div className="eight-ball-icon icon-40" alt="eight ball" />
                </div>
                <div className="summary-container">
                  <div className="stats-container">
                    <CurrentStats
                      season={this.state.latestSeason8}
                      position={findIndex(this.state.players8, {
                        staffName: this.state.player
                      })}
                      player={find(this.state.players8, {
                        staffName: this.state.player
                      })}
                    />
                    <AllTimeStats
                      ppg={
                        this.state.hofStat8
                          ? this.state.hofStat8.avgPoints
                          : null
                      }
                      wr={
                        this.state.hofStat8 ? this.state.hofStat8.winRate : null
                      }
                    />
                    <h2>Position History:</h2>
                    <div className="chart">
                      <CanvasJSChart
                        options={this.prepareChart(
                          this.state.positions8,
                          this.state.seasons8
                        )}
                      />
                    </div>
                  </div>
                  <SeasonAccordion type="8" staffName={this.state.player} />
                  <div className="arrangedFixturesContainer">
                    {this.state.bookings8.length ? (
                      /* if the player has bookings for 8-ball, display them here, otherwise, display a message */
                      <UpcomingMatch
                        bookings={this.state.bookings8}
                        player={this.state.player}
                      />
                    ) : (
                      <h4>You have no arranged fixtures</h4>
                    )}
                  </div>
                </div>
              </div>
              {/* 9-ball summary section that includes current league position, current form, some all-time stats,
              a graph showing previous league positions, fixtures that are due in the next two weeks, and upcoming bookings */}
              <div className="contentRight">
                <div className="summary-title">
                  <div className="nine-ball-icon icon-40" alt="nine ball" />
                  <h3>9-Ball Summary</h3>
                  <div className="nine-ball-icon icon-40" alt="nine ball" />
                </div>
                <div className="summary-container">
                  <div className="stats-container">
                    <CurrentStats
                      season={this.state.latestSeason9}
                      position={findIndex(this.state.players9, {
                        staffName: this.state.player
                      })}
                      player={find(this.state.players9, {
                        staffName: this.state.player
                      })}
                    />
                    <AllTimeStats
                      ppg={
                        this.state.hofStat9
                          ? this.state.hofStat9.avgPoints
                          : null
                      }
                      wr={
                        this.state.hofStat9 ? this.state.hofStat9.winRate : null
                      }
                    />

                    <div className="chart">
                      <h2>Position History:</h2>
                      <CanvasJSChart
                        options={this.prepareChart(
                          this.state.positions9,
                          this.state.seasons9
                        )}
                        onRef={ref => (this.chart = ref)}
                      />
                    </div>
                  </div>
                  <SeasonAccordion type="9" staffName={this.state.player} />
                  <div className="arrangedFixturesContainer">
                    {this.state.bookings9.length ? (
                      /* if the player has bookings for 9-ball, display them here, otherwise, display a message */
                      <UpcomingMatch
                        bookings={this.state.bookings9}
                        player={this.state.player}
                      />
                    ) : (
                      <h4>You have no arranged fixtures</h4>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default UserPage;
