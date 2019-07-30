import React from "react";
import moment from "moment";

const UpcomingMatch = props => {
  const body = props.bookings.map(booking => {
    return (
      <tr key={booking.id}>
        <td align="center">
          {moment(booking.start).format("ddd DD MMM YYYY")}
        </td>
        <td align="center">{moment(booking.start).format("HH:mm")}</td>
        <td align="center">{booking.title}</td>
      </tr>
    );
  });

  return (
    <div className="upcomingMatchesTableContainer">
      <h3>Upcoming Matches</h3>
      <table
        style={{ width: "40rem" }}
        className="upcomingMatchesTable"
        cellSpacing="0"
      >
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
    </div>
  );
};

export default UpcomingMatch;
