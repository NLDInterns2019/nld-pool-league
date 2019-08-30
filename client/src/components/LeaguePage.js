import React from "react";
import backend from "../api/backend";
import auth0Client from "../Auth";
import { toast } from "react-toastify";

import Header from "./nav/Header";
import SubNavBar from "./nav//SubNavBar";
import LeagueTable from "./league/LeagueTable";
import FixtureList from "./fixture/FixtureList";
import SubmitScoreForm from "./fixture/SubmitScoreForm";
import ViewYourFixtures from "./fixture/ViewYourFixtures";
import FinalRankings from "./league/FinalRankings";
import FinalStat from "./league/FinalStat";

import Axios from "axios";
import EditScoreForm from "./fixture/EditScoreForm";

class App extends React.Component {
  signal = Axios.CancelToken.source();

  state = {
    type: "",
    players: [],
    fixtures: [],
    activeSeason: 0,
    activePlayer: " ",
    groupCount: 0,
    hidePlayed: true,
    finished: null,
    playoff: false,
    drawPoints: "",
    isPlayoffButtonDisabled: false
  };

  updateData = async () => {
    try {
      /* gets league table for active season */
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

      /* gets fixtures for active season */
      const fixtures = await backend.get(
        "/api/89ball_fixture/" + this.state.activeSeason,
        {
          cancelToken: this.signal.token,
          params: {
            type: this.state.type,
            staffName: this.state.activePlayer,
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
        finished: season.data[0].finished,
        playoff: season.data[0].playoff
      });

      if (this.state.finished) {
        const result = await backend.get(
          `/api/89ball_league/${this.state.activeSeason}/check_draw`,
          {
            params: {
              type: parseInt(this.state.type)
            }
          }
        );
        this.setState({ drawPoints: result.data });
      }
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

  changeFixtureScore = async state => {
    /* edit fixture details in database */
    await backend
      .put(
        "/api/89ball_fixture/edit",
        {
          type: parseInt(this.state.type),
          seasonId: this.state.activeSeason,
          player1: state.player1,
          score1: parseInt(state.score1),
          player2: state.player2,
          score2: parseInt(state.score2),
          playoff: this.state.playoff
        },
        {
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
        }
      )
      .then(async () => {
        /* give user feedback and display the score they have just submitted */
        this.toastSuccess(
          <p>
            Result Submitted!
            <br />
            {state.player1} {state.score1} - {state.score2} {state.player2}
          </p>
        );
        this.updateData();
        if (!this.state.playoff) {
          /* if the fixture isn't in a playoff recalculate the league table */
          await backend.post(
            "/api/hall_of_fame/calculate_v2",
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
          );
          /* post a slack message informing people of the result */
          await backend.post(
            "/api/slack/resultSubmitted",
            {
              type: parseInt(this.state.type, 10),
              seasonId: this.state.activeSeason,
              players: state.players,
              score1: state.score1,
              score2: state.score2
            },
            {
              headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
            }
          );
        } else {
          /* post a slack message informing other of the playoff result */
          await backend.post(
            "/api/slack/playoffResultSubmitted",
            {
              type: parseInt(this.state.type, 10),
              seasonId: this.state.activeSeason,
              players: state.players,
              score1: state.score1,
              score2: state.score2
            },
            {
              headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
            }
          );
        }
      })
      .catch(e => {
        if (e.response.status === 401) {
          this.toastUnauthorised();
        } else {
          this.toastError(
            <div className="toast">
              <div className="no-entry-icon icon-24" alt="no entry" />
              <p>Something went wrong.</p>
            </div>
          );
        }
      });
  };

  editFixtureScore = async state => {
    //Change the fixture score
    await backend.put(
      "/api/89ball_fixture/edit/force",
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
    );
    //Recalculate league
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
      .then(async () => {
        this.toastSuccess(
          <p>
            Result Edited!
            <br />
            {state.player1} {state.score1} - {state.score2} {state.player2}
          </p>
        );
        this.updateData();
        /* post slack message to inform others that the score has been edited */
        await backend.post(
          "/api/slack/resultEdited",
          {
            type: parseInt(this.state.type, 10),
            seasonId: this.state.activeSeason,
            players: state.players,
            score1: state.score1,
            score2: state.score2
          },
          {
            headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
          }
        );
      })
      .catch(e => {
        if (e.response.status === 401) {
          this.toastUnauthorised();
        } else {
          this.toastError(
            <div className="toast">
              <div className="no-entry-icon icon-24" alt="no entry" />
              <p>Something went wrong.</p>
            </div>
          );
        }
      });
  };

  deletePlayer = async staffName => {
    try {
      if (this.state.finished === null) {
        this.toastError("Please try again later");
        /* if the season isn't finished and there are more than 2 players, delete the player,
        recalculate the league table, and send a slack message informing others of the removal */
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
        this.toastSuccess(`✅ ${staffName} Deleted!`);
        this.updateData();
        await backend.post(
          "/api/slack/playerRemoved",
          {
            staffName: staffName,
            type: parseInt(this.state.type, 10),
            seasonId: this.state.activeSeason
          },
          {
            headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
          }
        );
        /* otherwise display an error to the user */
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
          <div className="toast">
            <div className="no-entry-icon icon-24" alt="no entry" />
            <p>Something went wrong. Please try again</p>
          </div>
        );
      }
    }
  };

  closeSeason = async () => {
    try {
      /* close the season */
      await backend.put(
        "/api/89ball_season/close",
        {
          type: parseInt(this.state.type),
          seasonId: this.state.activeSeason,
          playoff: this.state.playoff
        },
        {
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
        }
      );
      /* if the season is not in a playoff, recalculate the league table */
      if (this.state.playoff === false || this.state.playoff === 0) {
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
      }
      /* provide user feedback */
      this.toastSuccess(
        <div className="toast">
          <div className="lock-icon-small icon-24" alt="lock" />
          <p>Season closed</p>
        </div>
      );
      await this.updateData();
      /* if the season is not in a playoff */
      if (!this.state.drawPoints.length) {
        backend.post(
          "/api/hall_of_fame/updateclosed",
          {
            type: parseInt(this.state.type, 10),
            seasonId: parseInt(this.state.activeSeason, 10)
          },
          {
            headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
          }
        );
        /* post a slack message saying that a season has been closed */
        backend.post(
          "/api/slack/seasonClosed",
          {
            type: parseInt(this.state.type, 10),
            seasonId: this.state.activeSeason
          },
          {
            headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
          }
        );
      } else {
        /* if the season is going to a playoff, send a slack message saying so */
        backend.post(
          "/api/slack/playoff",
          {
            type: parseInt(this.state.type, 10),
            seasonId: this.state.activeSeason
          },
          {
            headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
          }
        );
      }
    } catch (e) {
      if (e.response.status === 401) {
        this.toastUnauthorised();
      }
    }
  };

  /* displays negative feedback */
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

  /* displays negative feedback */
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

  /* displays positive feedback */
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

  /* run when user checks the 'show played fixtures' checkbox */
  applyViewFilter = async (staffName, hidePlayed) => {
    await this.setState({
      activePlayer: staffName,
      hidePlayed: hidePlayed
    });
    this.updateData();
  };

  /* function that just displays the submit result form */
  showSubmitResult = () => {
    return (
      <div
        style={{ marginTop: "4rem", marginBot: "4rem" }}
        className="submitScoreDiv"
      >
        <SubmitScoreForm
          players={this.state.players}
          type={this.state.type}
          changeFixtureScore={this.changeFixtureScore}
          editFixtureScore={this.editFixtureScore}
          activeSeason={this.state.activeSeason}
          isPlayoff={this.state.playoff}
        />
        <br />
        <br />
        {auth0Client.isAuthenticated() &&
        auth0Client.getProfile().nickname === "admin" ? (
          <button
            id="closeSeason"
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to close this season?\nCAUTION: THIS PROCESS CANNOT BE UNDONE"
                )
              )
                this.closeSeason();
            }}
          >
            Close Season
          </button>
        ) : null}
      </div>
    );
  };

  /* function that just shows the edit result form */
  showEditResult = () => {
    return (
      <EditScoreForm
        players={this.state.players}
        type={this.state.type}
        changeFixtureScore={this.changeFixtureScore}
        editFixtureScore={this.editFixtureScore}
        activeSeason={this.state.activeSeason}
      />
    );
  };

  /*
   *CHANGE DEFAULT SEASON JOINING FEE HERE
   */
  feePaid = async staffName => {
    try {
      await backend.put(
        "/api/89ball_league/paid",
        {
          type: parseInt(this.state.type, 10),
          seasonId: this.state.activeSeason,
          staffName: staffName
        },
        {
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
        }
      );

      await backend.post(
        "/api/kitty/transaction",
        {
          type: parseInt(this.state.type, 10),
          seasonId: this.state.activeSeason,
          staffName: staffName,
          description: `Joining fee`,
          //JOINING FEE
          value: 1
        },
        {
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
        }
      );
      this.updateData();
      this.toastSuccess("Success");
      await backend.post(
        "/api/slack/feePaid",
        {
          staffName: staffName,
          type: parseInt(this.state.type, 10),
          seasonId: this.state.activeSeason
        },
        {
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
        }
      );
    } catch (e) {
      if (e.response.status === 401) {
        this.toastUnauthorised();
      }
      if (e.response.status === 400) {
        this.toastError("Error");
      }
    }
  };

  /* displays a heading saying thay a playoff is required */
  showPlayoffRequired = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <div className="seasonClosed">
          <div className="playoff-icon-100-left icon-100" alt="playoff" />
          <h1 style={{ fontSize: "40pt" }}>Playoff Required</h1>
          <div className="playoff-icon-100-right icon-100" alt="playoff" />
        </div>
        <button
          onClick={this.arrangePlayoff}
          disabled={this.state.isPlayoffButtonDisabled}
          style={{ marginBottom: "4rem" }}
        >
          START PLAYOFF
        </button>
      </div>
    );
  };

  /* displays the top 3 players from the closed season */
  showFinalRankings = () => {
    return (
      <FinalRankings
        players={this.state.players}
        season={this.state.activeSeason}
      />
    );
  };

  /* displays honourable mentions table */
  showFinalStats = () => {
    return <FinalStat players={this.state.players} />;
  };

  addNewPlayer = async player => {
    /* add a new player to the database */
    await backend.post(
      "/api/89ball_league/add/player",
      {
        type: parseInt(this.state.type),
        seasonId: this.state.activeSeason,
        staffName: player
      },
      {
        headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
      }
    );

    /* generate fixtures containing the new player */
    await backend.post(
      "/api/89ball_fixture/generate/",
      {
        type: parseInt(this.state.type),
        seasonId: this.state.activeSeason,
        staffName: player
      },
      {
        headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
      }
    );

    this.updateData();

    this.sendNewPlayerSlackMessage(player);
  };

  arrangePlayoff = async () => {
    if (this.state.isPlayoffButtonDisabled) {
      return;
    }
    this.setState({ isPlayoffButtonDisabled: true });
    await backend.post(
      "/api/89ball_fixture/playoff",
      {
        type: parseInt(this.state.type),
        seasonId: this.state.activeSeason,
        draws: this.state.drawPoints
      },
      {
        headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
      }
    );
    await this.updateData();
    this.setState({ isPlayoffButtonDisabled: false });
  };

  /* posts a slack message saying a player has been added to the season */
  sendNewPlayerSlackMessage = async player => {
    await backend.post(
      "/api/slack/newPlayer",
      {
        player: player,
        type: parseInt(this.state.type),
        seasonId: this.state.activeSeason
      },
      {
        headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
      }
    );
  };

  render() {
    return (
      <div className="app">
        <Header />
        <SubNavBar
          type={this.state.type}
          activeSeason={this.state.activeSeason}
        />
        {/* if the season has finished, display the final rankings */}
        {this.state.finished === null
          ? null
          : this.state.finished && this.state.drawPoints.length > 0
          ? this.showPlayoffRequired()
          : this.state.finished && this.state.drawPoints !== ""
          ? this.showFinalRankings()
          : null}
        <div className="content">
          <div className="contentLeft">
            <LeagueTable
              activeSeason={this.state.activeSeason}
              players={this.state.players}
              deletePlayer={this.deletePlayer}
              feePaid={this.feePaid}
              addPlayer={this.addNewPlayer}
              hasFinished={this.state.finished}
              isPlayoff={this.state.playoff}
            />

            {/* if the season hasn't finished, show the submit score form */}
            {this.state.finished === null
              ? null
              : !this.state.finished
              ? this.showSubmitResult()
              : null}
          </div>
          <div className="contentRight">
            <div className="contentRight-top">
              {/* if the season has finished, show the final stats */}
              {this.state.finished ? this.showFinalStats() : null}
              <ViewYourFixtures
                players={this.state.players} //Force update when player is deleted
                type={this.state.type}
                activeSeason={this.state.activeSeason}
                applyFilter={this.applyViewFilter}
              />
              {/* if the season hasn't finished, show the edit result form */}
              {this.state.finished === null
                ? null
                : !this.state.finished
                ? this.showEditResult()
                : null}
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
