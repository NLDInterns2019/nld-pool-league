const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "NldPoolLeague",
  "nldpoolleague",
  process.env.DBPASSWORD,
  {
    host: "nldpoolleague.database.windows.net",
    dialect: "mssql",
    dialectOptions: {
      options: {
        encrypt: true
      }
    }
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

var db = {};

db.staff = sequelize.import(__dirname + "/models/staff.js");
db.eight_ball_league = sequelize.import(__dirname + "/models/eight_ball_league.js");

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
