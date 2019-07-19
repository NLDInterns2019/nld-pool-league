import React from "react";
import backend from "../api/backend";
import auth0Client from "../Auth";
import { ToastContainer, toast } from "react-toastify";

import Header from "./nav/Header.js";
import SubNavBar from "./nav//SubNavBar.js";
import LeagueTable from "./league/LeagueTable.js";
import FixtureList from "./fixture/FixtureList";
import SubmitScoreForm from "./fixture/SubmitScoreForm.js";
import ViewYourFixtures from "./fixture/ViewYourFixtures.js";
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
    unplayedViewFixtures: [],
    viewFixtures: [],
    activeSeason: 0,
    activeViewPlayer: " ",
    activeSubmitPlayer: " ",
    groupCount: 0,
    hidePlayed: true
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

      const viewFixtures = await backend.get(
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

      this.setState({ viewFixtures: viewFixtures.data });

      const unplayedViewFixtures = await backend.get(
        "/api/89ball_fixture/" + this.state.activeSeason,
        {
          cancelToken: this.signal.token,
          params: {
            type: this.state.type,
            staffName: this.state.activeViewPlayer,
            hidePlayed: true
          }
        }
      );

      this.setState({ unplayedViewFixtures: unplayedViewFixtures.data });

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

    console.log("Score message posted!");
  };

  changeFixtureScore = async state => {
    console.log(state);
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
        this.toastUnauthorised();
      });
  };

  toastUnauthorised = () => {
    toast.error("⛔ Unauthorised! Please login", {
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
            />
            <SubmitScoreForm
              type={this.state.type}
              changeFixtureScore={this.changeFixtureScore}
              activeSeason={this.state.activeSeason}
              applySubmitFilter={this.applySubmitFilter}
            />
          </div>
          <div className="contentRight">
            <div className="contentRight-top">
              <ViewYourFixtures
                type={this.state.type}
                activeSeason={this.state.activeSeason}
                applyFilter={this.applyViewFilter}
              />
            </div>
            <div className="contentRight-bottom">
              <FixtureList
                fixtures={this.state.viewFixtures}
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
