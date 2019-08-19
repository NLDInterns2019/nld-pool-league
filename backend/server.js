const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const schedule = require("./functions/schedule");

//Define routes
let eight_nine_ball_season = require("./routes/eight_nine_ball_seasons"),
  eight_nine_ball_leagues = require("./routes/eight_nine_ball_leagues"),
  eight_nine_ball_fixtures = require("./routes/eight_nine_ball_fixtures"),
  hall_of_fame = require("./routes/hall_of_fame"),
  bookings = require("./routes/bookings"),
  slack = require("./routes/slack"),
  kitty = require("./routes/kitty"),
  position_history = require("./routes/position_history");

const PORT = process.env.PORT || 8080;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/89ball_season", eight_nine_ball_season);
app.use("/api/89ball_league", eight_nine_ball_leagues);
app.use("/api/89ball_fixture", eight_nine_ball_fixtures);
app.use("/api/hall_of_fame", hall_of_fame);
app.use("/api/booking", bookings);
app.use("/api/slack", slack);
app.use("/api/kitty", kitty);
app.use("/api/position_history", position_history)

// Serve the static files from the production build of the client
app.use(express.static(path.join(__dirname, "..", "client", "build")));
app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

// RUN EVERY DAY AT 7 AM
schedule.todayBookings;

// Send overdue fixtures reminder every monday at 7am after the fixture date
schedule.overdueFixtures;

/* Outstanding payment reminder to post at 7am every monday */
schedule.outstandingPayments;

app.listen(PORT, () => {
  console.log("Express is listening on port: " + PORT);
});

// Export our app for testing purposes
module.exports = app;
