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
const schedule = require("node-schedule");

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

  deleteScheduledSlackMessage = messageId => {
    this.web.chat.deleteScheduledMessage({
      channel: this.channel,
      scheduled_message_id: messageId
    });
  };

  handleDoubleClick = async e => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      await backend
        .delete("/api/booking/delete/", {
          data: {
            id: e.id
          },
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
        })
        .then(() => {
          this.toastSuccess("Booking Deleted!");
          this.getBookings();
          this.deleteScheduledSlackMessage(e.messageId);
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

  /* post the message to the correct slack channel */
  postTodaysFixturesSlackMessage = async message => {
    await this.web.chat.postMessage({
      channel: this.channel,
      text: "Fixtures Today:\n" + message
    });
  };

  scheduleDailyFixtureMessage = () => {
    schedule.scheduleJob(
      "0 7 * * *",
      this.postTodaysFixturesSlackMessage(
        this.prepareTodaysFixturesSlackMessage(this.getTodaysFixtures())
      )
    );
  };

  /* posts a message to a slack channel with the booking that has been created */
  postBookingUpdateSlackMessage = async (type, player1, player2, start) => {
    var date = moment(start).format("DD-MMM-YYYY");
    var time = moment(start).format("HH:mm");
    await this.web.chat.postMessage({
      channel: this.channel,
      /* post a message saying 'new emoji booking: PLAYER1 X - X PLAYER2 on DD/MM/YYYY at hh:mm' */
      text:
        (type === "8" ? ":8ball:" : type === "9" ? ":9ball:" : "TYPE ERROR") +
        " Booking created:\n" +
        player1 +
        "  VS  " +
        player2 +
        "  on " +
        date +
        " at " +
        time
    });
  };

  /* schedules a message to be posted in a slack channel at 9am on the day of a fixture and 15 mins before the fixture */
  scheduleSlackReminder = async (type, player1, player2, start) => {
    /* gets the time of the fixture e.g. 13:30 */
    var time = moment(start).format("HH:mm");

    var fifteenMinsBefore = moment(start)
      .subtract(15, "minutes")
      .unix();

    if (moment() < moment(start)) {
      /* schedules a message to be posted in the channel 15 mins before the scheduled fixture */
      return new Promise((resolve, reject) => {
        resolve(
          this.web.chat.scheduleMessage({
            channel: this.channel,
            text:
              (type === "8"
                ? ":8ball:"
                : type === "9"
                ? ":9ball:"
                : "TYPE ERROR") +
              " Reminder: \n" +
              player1 +
              "  vs  " +
              player2 +
              " at " +
              time,
            post_at: fifteenMinsBefore
          })
        );
      });
    }
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
      .then(id => {
        this.toastSuccess("Booking Success!");
        this.closePopUp();
        this.postBookingUpdateSlackMessage(
          this.state.type,
          player1,
          player2,
          this.state.start
        );
        this.scheduleSlackReminder(
          this.state.type,
          player1,
          player2,
          this.state.start
        ).then(result => {
          //Add message id to db
          backend.put(
            "/api/booking/add/message_id",
            {
              id: id.data[0],
              messageId: result.scheduled_message_id
            },
            {
              headers: headers
            }
          );
          //Update bookings
          this.getBookings();
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
