import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "../react-big-calendar.css";
import "../rbc-dnd.css";

import moment from "moment";
import { toast } from "react-toastify";

import auth0Client from "../Auth";

import CreateBooking from "./fixture/CreateBooking";
import Header from "./nav/Header";
import SubNavBar from "./nav/SubNavBar";
import backend from "../api/backend";

const localizer = momentLocalizer(moment);

const DnDCalendar = withDragAndDrop(Calendar);

class FixturesPage extends Component {
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

  /* function for refreshing the bookings */
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

  /* run when an empty slot is clicked */
  handleSelect = async ({ start, end }) => {
    /* if the time of the slot selected is after the current date and time, open the pop-up, otherwise, do nothing */
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

  /* run when a scheduled event is double clicked */
  handleDoubleClick = async event => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      /* delete the booking in the database */
      await backend
        .delete("/api/booking/delete/", {
          data: {
            id: event.id
          },
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
        })
        .then(async () => {
          /* if the scheduled event was in the future, delete the scheduled slack message */
          if (moment() < moment(event.start)) {
            if (event.messageId) {
              await backend.delete("api/slack/booking/reminder", {
                data: {
                  messageId: event.messageId
                },
                headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
              });
            }
          }
          /* provide the user with feedback */
          this.toastSuccess("Booking Deleted!");
          /* refresh the bookings */
          this.getBookings();
        })
        .catch(e => {
          if (e.response.status === 401) {
            this.toastUnauthorised();
          }
        });
    }
  };

  /* run when the user drags and drops a scheduled event to another time slot */
  handleDragAndDrop = async ({ event, start, end, allDay }) => {
    if (auth0Client.isAuthenticated()) {
      try {
        /* delete the old scheduled slack message */
        backend.delete("api/slack/booking/reminder", {
          data: {
            messageId: event.messageId
          },
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
        });

        /* post a new slack message with the new date and time */
        backend.post(
          "/api/slack/booking",
          {
            type: parseInt(this.state.type, 10),
            start: moment(start).toISOString(),
            player1: event.player1,
            player2: event.player2
          },
          {
            headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
          }
        );

        /* schedule a new reminder for 15 minutes before the fixture */
        await backend
          .post(
            "/api/slack/booking/reminder",
            {
              type: parseInt(this.state.type, 10),
              start: moment(start).toISOString(),
              player1: event.player1,
              player2: event.player2
            },
            {
              headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
            }
          )
          .then(async result => {
            /* edit the booking details in the database */
            await backend.put(
              "/api/booking/edit",
              {
                id: event.id,
                messageId: result.data.scheduled_message_id,
                start: moment(start).toISOString(),
                end: moment(end).toISOString()
              },
              {
                headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
              }
            );
            /* refresh the bookings */
            this.getBookings();
          });
      } catch (err) {
        console.log(err);
      }
    } else {
      /* display feedback */
      this.toastUnauthorised();
    }
  };

  /* opens the form for arranging a fixture */
  openPopUp = () => {
    this.refs.popup.style.display = "block";
    this.refs.container.style.display = "block";
  };

  /* closes the form for arranging a fixture */
  closePopUp = () => {
    this.refs.popup.style.display = "none";
    this.refs.container.style.display = "none";
  };

  makeBooking = async (player1, player2, isFriendly) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth0Client.getIdToken()}`
    };

    let type = parseInt(this.state.type, 10);
    if (isFriendly) type = 0;

    /* adds a booking to the database */
    await backend
      .post(
        "/api/booking/add",
        {
          start: this.state.start,
          end: this.state.end,
          type: type,
          player1: player1,
          player2: player2,
          title: `${player1} VS ${player2}`
        },
        {
          headers: headers
        }
      )
      .then(async id => {
        /* display feedback */
        this.toastSuccess("Booking Success!");
        this.closePopUp();
        /* post slack message saying that a new booking has been made */
        backend.post(
          "/api/slack/booking",
          {
            type: type,
            start: this.state.start,
            player1: player1,
            player2: player2
          },
          {
            headers: headers
          }
        );
        /* schedule a slack message to be posted 15 minutes before the fixture is due to start */
        backend
          .post(
            "/api/slack/booking/reminder",
            {
              type: type,
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
              /* add scheduled message id to the booking in database */
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
              /* refresh bookings */
              this.getBookings();
            } else {
              /* refresh bookings */
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

  /* displays positive feedback to the user */
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

  /* displays negative feedback to the user */
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

  /* posts negative feedback to the user */
  toastInvalid = () => {
    toast.error(
      <div className="toast">
        <div className="no-entry-icon icon-24" alt="no entry" />
        <p>
          Invalid booking! <br /> Choose another timeslot
        </p>
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

  render() {
    return (
      <div className="fixtures">
        <Header />
        <SubNavBar
          activeSeason={this.state.activeSeason}
          type={this.state.type}
        />
        <div id="calendarContainer">
          <h3>Arrange Fixtures</h3>
          <h4>Click an empty slot to create a booking</h4>
          <h4>Double click an event to delete a booking</h4>
          <h4>Drag and drop an event to edit the timeslot (might be buggy)</h4>
          <DnDCalendar
            selectable
            localizer={localizer}
            resizableAccessor={() => false}
            defaultDate={new Date()}
            views={["work_week", "day"]}
            defaultView="work_week"
            min={new Date(2017, 10, 0, 8, 0, 0)}
            max={new Date(2017, 10, 0, 18, 30, 0)}
            events={this.state.events}
            onDoubleClickEvent={this.handleDoubleClick}
            onSelectSlot={this.handleSelect}
            onSelectEvent={this.handleSelectEvent}
            onEventDrop={this.handleDragAndDrop}
          />
        </div>
        <div className="popup-container" id="container" ref="container">
          <div className="form-popup" id="popup" ref="popup">
            <CreateBooking
              type={this.state.type}
              start={this.state.start}
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
