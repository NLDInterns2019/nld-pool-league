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
        {booking.player1 === props.player ? (
          <td align="center">{booking.player2}</td>
        ) : (
          <td align="center">{booking.player1}</td>
        )}
      </tr>
    );
  });

  return (
    <div className="upcomingMatchesTableContainer">
      <h4 style={{ fontWeight: "bold" }}>Upcoming Arranged Matches:</h4>

      <table
        style={{ width: "100%", textAlign: "center", fontSize: "14pt" }}
        className="upcomingMatchesTable"
        cellSpacing="0"
      >
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Opponent</th>
          </tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
    </div>
  );
};

export default UpcomingMatch;
