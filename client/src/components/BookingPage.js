import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "../react-big-calendar.css";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";

import auth0Client from "../Auth";

import CreateBooking from "./fixture/CreateBooking";
import Header from "./nav/Header";
import SubNavBar from "./nav/SubNavBar";
import backend from "../api/backend";

const { WebClient } = require("@slack/web-api");

const localizer = momentLocalizer(moment);

class FixturesPage extends Component {
  constructor(props) {
    super(props);
    /* slack token */
    const token =
      "xoxp-685145909105-693344350935-691496978112-a5c73f958a992b52284cfcc86433895e";
    /* test channel */
    this.channel = "CLB0QN8JY";
    this.web = new WebClient(token);
  }

  state = {
    type: "",
    fixtures: [],
    groupCount: 0,
    refresh: false,
    activeSeason: 0,
    events: [],
    start: "",
    end: ""
  };

  getBookings = async () => {
    const bookings = await backend.get("/api/booking");

    const parsedBookings = bookings.data.map(booking => {
      booking.start = new Date(booking.start);
      booking.end = new Date(booking.end);
      return booking;
    });

    this.setState({ events: parsedBookings });
  };

  componentDidMount = async () => {
    await this.setState({
      type: this.props.match.params.type,
      activeSeason: this.props.match.params.seasonId
    });
    this.getBookings();
  };

  handleSelect = async ({ start, end }) => {
    if (moment() < moment(start)) {
      await this.setState({
        start: moment(start)
          .toDate()
          .toISOString(),
        end: moment(end)
          .toDate()
          .toISOString()
      });
      this.openPopUp();
    }
  };

  handleDoubleClick = async event => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      await backend
        .delete("/api/booking/delete/", {
          data: {
            id: event.id
          },
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
        })
        .then(async () => {
          if(event.messageId){
            await backend.delete("api/slack/booking/reminder", {
              data: {
                messageId: event.messageId
              },
              headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
            });
          }
          this.toastSuccess("Booking Deleted!");
          this.getBookings();
        })
        .catch(e => {
          if (e.response.status === 401) {
            this.toastUnauthorised();
          }
        });
    }
  };

  openPopUp = () => {
    this.refs.popup.style.display = "block";
    this.refs.container.style.display = "block";
  };

  closePopUp = () => {
    this.refs.popup.style.display = "none";
    this.refs.container.style.display = "none";
  };

  /* get all of the fixtures that are booked to be played today */
  getTodaysFixtures = () => {
    var todaysFixtures = [];
    for (var i = 0; i < this.state.events.length; i++) {
      if (
        moment(this.state.events[i].start).dayOfYear() ===
          moment().dayOfYear() &&
        moment(this.state.events[i].start).year() === moment().year()
      ) {
        console.log("pushing");
        todaysFixtures.push(this.state.events[i]);
      }
    }
    console.log(todaysFixtures);
    return todaysFixtures;
  };

  /* take the fixtures booked today and convert them into a message string */
  prepareTodaysFixturesSlackMessage = todaysFixtures => {
    var finalMessage = "";
    for (var i = 0; i < todaysFixtures.length; i++) {
      finalMessage = finalMessage.concat(
        todaysFixtures[i].title.toLowerCase() +
          " at " +
          moment(todaysFixtures[i].start).format("HH:mm") +
          "\n"
      );
    }
    return finalMessage;
  };

  makeBooking = async (player1, player2) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth0Client.getIdToken()}`
    };

    await backend
      .post(
        "/api/booking/add",
        {
          start: this.state.start,
          end: this.state.end,
          player1: player1,
          player2: player2,
          title: `${player1} VS ${player2}`
        },
        {
          headers: headers
        }
      )
      .then(async id => {
        this.toastSuccess("Booking Success!");
        this.closePopUp();
        //POST that new booking have been made
        backend.post(
          "/api/slack/booking",
          {
            type: parseInt(this.state.type, 10),
            start: this.state.start,
            player1: player1,
            player2: player2
          },
          {
            headers: headers
          }
        );
        //CREATE reminder
        backend
          .post(
            "/api/slack/booking/reminder",
            {
              type: parseInt(this.state.type, 10),
              start: this.state.start,
              player1: player1,
              player2: player2
            },
            {
              headers: headers
            }
          )
          .then(async result => {
            if (result.status === 200) {
              //Add message id to db
              await backend.put(
                "/api/booking/add/message_id",
                {
                  id: id.data[0],
                  messageId: result.data.scheduled_message_id
                },
                {
                  headers: headers
                }
              );
              this.getBookings();
            } else {
              //Update bookings
              this.getBookings();
            }
          });
      })
      .catch(e => {
        if (e.response.status === 401) {
          this.toastUnauthorised();
        }
        if (e.response.status === 400) {
          this.toastInvalid();
        }
      });
  };

  toastSuccess = message => {
    toast.success(`✅ ${message}!`, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  toastUnauthorised = () => {
    toast.error(
      <p>
        <span role="img" aria-label="forbidden">
          ⛔
        </span>
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

  toastInvalid = () => {
    toast.error(
      <p>
        <span role="img" aria-label="forbidden">
          ⛔
        </span>{" "}
        Invalid booking! <br /> Choose another timeslot
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

  render() {
    return (
      <div className="fixtures">
        <ToastContainer />
        <Header />
        <SubNavBar
          activeSeason={this.state.activeSeason}
          type={this.state.type}
        />
        <div id="calendarContainer">
          <h3>Arrange Fixtures</h3>
          <h4>Click an empty slot to create a booking</h4>
          <h4>Double click an event to delete a booking</h4>
          <Calendar
            selectable
            localizer={localizer}
            defaultDate={new Date()}
            views={["work_week", "day"]}
            defaultView="work_week"
            min={new Date(2017, 10, 0, 8, 0, 0)}
            max={new Date(2017, 10, 0, 18, 0, 0)}
            events={this.state.events}
            onDoubleClickEvent={this.handleDoubleClick}
            onSelectSlot={this.handleSelect}
            onSelectEvent={this.handleSelectEvent}
          />
        </div>
        <div className="popup-container" id="container" ref="container">
          <div className="form-popup" id="popup" ref="popup">
            <CreateBooking
              type={this.state.type}
              activeSeason={this.state.activeSeason}
              makeBooking={this.makeBooking}
            />
            <button type="button" id="cancelbtn" onClick={this.closePopUp}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default FixturesPage;
