const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//Define routes
let eight_ball_season = require("./routes/eight_ball_seasons"),
    eight_ball_leagues = require("./routes/eight_ball_leagues"),
    eight_ball_fixtures = require("./routes/eight_ball_fixtures");

const PORT = process.env.PORT || 8080;

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/api/8ball_season", eight_ball_season);
app.use("/api/8ball_league", eight_ball_leagues);
app.use("/api/8ball_fixture", eight_ball_fixtures);

app.listen(PORT, () => {
  console.log("Express is listening on port: " + PORT);
});
