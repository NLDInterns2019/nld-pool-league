import React from "react";
import backend from "../api/backend";
import auth0Client from "../Auth";
import { ToastContainer, toast } from "react-toastify";

import Header from "./nav/Header";
import SubNavBar from "./nav//SubNavBar";
import LeagueTable from "./league/LeagueTable";
import FixtureList from "./fixture/FixtureList";
import SubmitScoreForm from "./fixture/SubmitScoreForm";
import ViewYourFixtures from "./fixture/ViewYourFixtures";
import FinalRankTable from "./league/FinalRankTable";
import FinalStat from "./league/FinalStat";

import Axios from "axios";

const { WebClient } = require("@slack/web-api");

class App extends React.Component {
  constructor(props) {
    super(props);

    /* slack token */
    const token =
      "xoxp-685145909105-693344350935-691496978112-a5c73f958a992b52284cfcc86433895e";
    /* test channel */
    this.channel = "CLB0QN8JY";
    this.web = new WebClient(token);
  }

  signal = Axios.CancelToken.source();

  state = {
    type: "",
    players: [],
    fixtures: [],
    activeSeason: 0,
    activeViewPlayer: " ",
    activeSubmitPlayer: " ",
    groupCount: 0,
    hidePlayed: true,
    finished: null
  };

  updateData = async () => {
    try {
      const response = await backend.get(
        "/api/89ball_league/" + this.state.activeSeason,
        {
          cancelToken: this.signal.token,
          params: {
            type: this.state.type
          }
        }
      );

      this.setState({ players: response.data });

      const fixtures = await backend.get(
        "/api/89ball_fixture/" + this.state.activeSeason,
        {
          cancelToken: this.signal.token,
          params: {
            type: this.state.type,
            staffName: this.state.activeViewPlayer,
            hidePlayed: this.state.hidePlayed
          }
        }
      );

      this.setState({ fixtures: fixtures.data });

      const count = await backend.get(
        "/api/89ball_fixture/group/" + this.state.activeSeason,
        {
          cancelToken: this.signal.token,
          params: {
            type: this.state.type
          }
        }
      );

      this.setState({ groupCount: count.data[0] });

      const season = await backend.get(
        "/api/89ball_season/" + this.state.activeSeason,
        {
          cancelToken: this.signal.token,
          params: {
            type: this.state.type
          }
        }
      );
      this.setState({
        finished: season.data[0].finished
      });
    } catch (err) {
      //API CALL BEING CANCELED
    }
  };

  componentDidMount = async () => {
    await this.setState({ type: this.props.match.params.type });
    await this.setState({
      activeSeason: parseInt(this.props.match.params.seasonId)
    });

    this.updateData();
  };

  componentWillUnmount() {
    this.signal.cancel("");
  }

  /* posts a message to a slack channel with the submitted score */
  postScoreUpdateSlackMessage = async (type, players, score1, score2) => {
    await this.web.chat.postMessage({
      channel: this.channel,
      /* post a message saying 'emoji PLAYER1 X - X PLAYER2' */
      text:
        (type === "8" ? ":8ball:" : type === "9" ? ":9ball:" : "TYPE ERROR") +
        " Result:\n" +
        players.split(" ")[0] +
        "  " +
        score1 +
        "  -  " +
        score2 +
        "  " +
        players.split(" ")[1]
    });
  };

  changeFixtureScore = async state => {
    await backend
      .put(
        "/api/89ball_fixture/edit",
        {
          type: parseInt(this.state.type),
          seasonId: this.state.activeSeason,
          player1: state.player1,
          score1: parseInt(state.score1),
          player2: state.player2,
          score2: parseInt(state.score2)
        },
        {
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
        }
      )
      .then(() => {
        this.toastSucess(
          <p>
            Result Submitted!
            <br />
            {state.player1} {state.score1} - {state.score2} {state.player2}
          </p>
        );
        this.updateData();
        this.postScoreUpdateSlackMessage(
          this.state.type,
          state.players,
          state.score1,
          state.score2
        );
      })
      .catch(e => {
        if (e.response.status === 401) {
          this.toastUnauthorised();
        } else {
          this.toastError(
            <p>
              <span role="img" aria-label="forbidden">
                ⛔
              </span>{" "}
              Something went wrong. Please try again
            </p>
          );
        }
      });
  };

  deletePlayer = async staffName => {
    try {
      if (this.state.finished === null) {
        this.toastError("Please try again later");
      } else if (!this.state.finished && this.state.players.length > 2) {
        await backend.delete("/api/89ball_league/delete/player", {
          data: {
            type: parseInt(this.state.type),
            seasonId: this.state.activeSeason,
            staffName: staffName
          },
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
        });

        await backend.put(
          "/api/89ball_league/recalculate",
          {
            type: parseInt(this.state.type),
            seasonId: this.state.activeSeason
          },
          {
            headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
          }
        );
        this.toastSucess(`🗑️${staffName} Deleted!`);
        this.updateData();
      } else if (this.state.finished) {
        this.toastError("Season closed, unable to delete player.");
      } else {
        this.toastError("Bad request! Minimum of 2 players are needed.");
      }
    } catch (e) {
      if (e.response.status === 401) {
        this.toastUnauthorised();
      } else {
        this.toastError(
          <p>
            <span role="img" aria-label="forbidden">
              ⛔
            </span>{" "}
            Something went wrong. Please try again
          </p>
        );
      }
    }
  };

  closeSeason = async () => {
    try {
      await backend.put(
        "/api/89ball_season/close",
        {
          type: parseInt(this.state.type),
          seasonId: this.state.activeSeason
        },
        {
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
        }
      );
      await backend
        .put(
          "/api/89ball_league/recalculate",
          {
            type: parseInt(this.state.type),
            seasonId: this.state.activeSeason
          },
          {
            headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
          }
        )
        .then(() => {
          this.toastSucess("🔐 Season closed");
          this.updateData();
        });
    } catch (e) {
      if (e.response.status === 401) {
        this.toastUnauthorised();
      }
    }
  };

  toastUnauthorised = () => {
    toast.error(
      <p>
        <span role="img" aria-label="forbidden">
          ⛔
        </span>{" "}
        Unauthorised! Please login
      </p>,
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

  toastSucess = message => {
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  applyViewFilter = async (staffName, hidePlayed) => {
    await this.setState({
      activeViewPlayer: staffName,
      hidePlayed: hidePlayed
    });
    this.updateData();
  };

  showSubmitResult = () => {
    return (
      <div style={{ marginTop: "4rem", marginBot: "4rem" }} className="submitScoreDiv">
        <SubmitScoreForm
          players={this.state.players}
          type={this.state.type}
          changeFixtureScore={this.changeFixtureScore}
          activeSeason={this.state.activeSeason}
        />
        <br />
        <br />
        <button
          id="closeSeason"
          onClick={() => {
            if (window.confirm("Are you sure you want to close this season?"))
              this.closeSeason();
          }}
        >
          Close Season
        </button>
      </div>
    );
  };

  showSeasonClosed = () => {
    return (
      <div>
        <div className="seasonClosed">
          <div className="lock-icon" alt="lock" />
          <h1> Season is closed</h1>
          <div className="lock-icon" alt="lock" />
        </div>
        <FinalRankTable
          activeSeason={this.state.activeSeason}
          players={this.state.players}
        />
        <FinalStat players={this.state.players} />
      </div>
    );
  };

  render() {
    return (
      <div className="app">
        <ToastContainer />
        <Header />
        <SubNavBar
          type={this.state.type}
          activeSeason={this.state.activeSeason}
        />
        <div className="content">
          <div className="contentLeft">
            <LeagueTable
              activeSeason={this.state.activeSeason}
              players={this.state.players}
              deletePlayer={this.deletePlayer}
            />
            {this.state.finished === null
              ? null
              : this.state.finished
              ? this.showSeasonClosed()
              : this.showSubmitResult()}
          </div>
          <div className="contentRight">
            <div className="contentRight-top">
              <ViewYourFixtures
                players={this.state.players} //Force update when player is deleted
                type={this.state.type}
                activeSeason={this.state.activeSeason}
                applyFilter={this.applyViewFilter}
              />
            </div>
            <div className="contentRight-bottom">
              <FixtureList
                fixtures={this.state.fixtures}
                groupCount={this.state.groupCount}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
