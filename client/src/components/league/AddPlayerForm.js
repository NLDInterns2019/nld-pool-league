import React, { Component } from "react";
import { orderBy, filter } from "lodash";
import auth0Client from "../../Auth";
import backend from "../../api/backend";
import Axios from "axios";

class AddPlayerForm extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      auth0Players: [],
      playersName: [],
      isAuthenticated: false
    };

    this.state = this.initialState;

    /* refs for add player form */
    this.addPlayerBtn = React.createRef();
    this.hiddenForm = React.createRef();
    this.confirmBtn = React.createRef();
    this.inputPlayer = React.createRef();
  }

  signal = Axios.CancelToken.source();

  getPlayers = async () => {
    try {
      await backend
        .get("/api/89ball_season/playersdb", {
          cancelToken: this.signal.token,
          params: {},
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
        })
        .then(res => {
          this.setState({
            auth0Players: orderBy(res.data, ["username"], ["asc"]),
            playersName: orderBy(this.props.players, ["staffName"], ["asc"])
              .filter(player => player.staffName !== "admin")
              .map(player => player.staffName)
          });
        });
    } catch (e) {
      //API CALL BEING CANCELLED
    }
  };

  handleClick = async event => {
    /* if the form is currently not visible, display it and hide the '+add new player' button */
    if (this.hiddenForm.current.style.display === "none") {
      this.hiddenForm.current.style = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      };
      this.addPlayerBtn.current.style.display = "none";
    } else {
      /* otherwise, hide the form and display the '+add new player' button */
      this.hiddenForm.current.style.display = "none";
      this.addPlayerBtn.current.style = {
        display: "flex"
      };
      /* if the button being clicked is the confirm button, add the player in the drop-down to the season */
      if (event.target === this.confirmBtn.current) {
        var player = this.inputPlayer.current.value;
        await this.props.addPlayer(player);
        this.getPlayers();
      }
    }
  };

  componentDidMount() {
    if (this.state.isAuthenticated === false && auth0Client.isAuthenticated()) {
      this.setState({ isAuthenticated: true });
      this.getPlayers();
    }
  }

  componentWillUnmount() {
    this.signal.cancel("");
  }

  render() {
    return (
      <div className="addPlayerForm">
        <button
          type="button"
          onClick={this.handleClick}
          ref={this.addPlayerBtn}
          id="addPlayerBtn"
        >
          + Add New Player
        </button>
        <div
          className="hiddenForm"
          ref={this.hiddenForm}
          style={{ display: "none" }}
        >
          <h3>Add New Player</h3>
          <label>Select a player:</label>
          <select ref={this.inputPlayer}>
            {/* only show the players that aren't in the current season and that are not admin */}
            {filter(
              this.state.auth0Players,
              p =>
                !this.state.playersName.includes(p.username) &&
                p.username !== "admin"
            ).map(player => {
              return (
                <option key={player.username} value={player.username}>
                  {player.username}
                </option>
              );
            })}
          </select>

          <div className="addPlayerFormButtons">
            <button type="button" onClick={this.handleClick} id="cancelBtn">
              Cancel
            </button>
            <button
              type="button"
              onClick={event => this.handleClick(event)}
              ref={this.confirmBtn}
              id="confirmBtn"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default AddPlayerForm;
