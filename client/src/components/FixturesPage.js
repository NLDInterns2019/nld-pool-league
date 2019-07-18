import React, { Component } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "../react-big-calendar.css";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";

import ArrangeFixture from "./fixture/ArrangeFixture";
import Header from "./nav/Header";
import SubNavBar from "./nav/SubNavBar";

const localizer = momentLocalizer(moment);

class FixturesPage extends Component {
  state = {
    type: "",
    fixtures: [],
    groupCount: 0,
    refresh: false,
    activeSeason: 0,
    events: []
  };

  componentDidMount = async () => {
    await this.setState({
      type: this.props.match.params.type,
      activeSeason: this.props.match.params.seasonId
    });
  };

  handleSelect = ({ start, end }) => {
    // const title = window.prompt("New Event name");
    // if (title)
    //   this.setState({
    //     events: [
    //       ...this.state.events,
    //       {
    //         start,
    //         end,
    //         title
    //       }
    //     ]
    //   });
    this.openPopUp();
  };

  handleEventClick = e => {
    const start =
      e.start.getHours().toString() + ":" + e.start.getMinutes().toString();
    const end =
      e.end.getHours().toString() + ":" + e.end.getMinutes().toString();
    const text = (
      <p>
        {e.title}
        <br />
        From:{start} To: {end}
      </p>
    );
    toast.info(text, {
      position: "top-center",
      autoClose: 2000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  openPopUp() {
    this.refs.popup.style.display = "block";
    this.refs.container.style.display = "block";
  }

  closePopUp() {
    this.refs.popup.style.display = "none";
    this.refs.container.style.display = "none";
  }

  render() {
    return (
      <div className="fixtures">
        <ToastContainer />
        <Header />
        <SubNavBar
          activeSeason={this.state.activeSeason}
          type={this.state.type}
        />
        <div
          style={{
            width: "80%",
            height: "80vh",
            margin: "auto",
            backgroundColor: "white",
            padding: "50px",
            borderRadius: "15px"
          }}
        >
          <Calendar
            selectable
            localizer={localizer}
            defaultDate={new Date()}
            views={["month", "week"]}
            defaultView="week"
            min={new Date(2017, 10, 0, 8, 0, 0)}
            max={new Date(2017, 10, 0, 18, 0, 0)}
            events={this.state.events}
            onSelectEvent={this.handleEventClick}
            onSelectSlot={this.handleSelect}
          />
        </div>
        <div className="popup-container" id="container" ref="container">
          <div className="form-popup" id="popup" ref="popup">
            <ArrangeFixture
              type={this.state.type}
              closePopUp={this.closePopUp.bind(this)}
            />
            <button
              type="button"
              id="cancelbtn"
              onClick={this.closePopUp.bind(this)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default FixturesPage;
