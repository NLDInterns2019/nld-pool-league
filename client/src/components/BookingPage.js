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

  handleDragAndDrop = async ({ event, start, end, allDay }) => {
    if (auth0Client.isAuthenticated()) {
      try {
        //Delete old reminder
        backend.delete("api/slack/booking/reminder", {
          data: {
            messageId: event.messageId
          },
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
        });

        //Post
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

        //Schedule reminder
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
            this.getBookings();
          });
      } catch (err) {
        console.log(err);
      }
    } else {
      this.toastUnauthorised();
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
          type: parseInt(this.state.type, 10),
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
      <div className="toast">
        <div className="no-entry-icon" alt="no entry" />
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

  toastInvalid = () => {
    toast.error(
      <div className="toast">
        <div className="no-entry-icon" alt="no entry" />
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
