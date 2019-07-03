const Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";

let sequelize;

if (env === "production") {
  sequelize = new Sequelize(
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
} else {
  sequelize = new Sequelize(undefined, undefined, undefined, {
    dialect: "sqlite",
    storage: __dirname + "/data/nld-pool-db.sqlite"
  });
}

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

var db = {};

//8 ball seasons schema
db.eight_ball_seasons = sequelize.import(
  __dirname + "/models/eight_ball_seasons.js"
);
//8 ball league schema
db.eight_ball_leagues = sequelize.import(
  __dirname + "/models/eight_ball_leagues.js"
);
//8 ball fixtures schema
db.eight_ball_fixtures = sequelize.import(
  __dirname + "/models/eight_ball_fixtures.js"
);

// //Association
// //A league has many fixtures
// db.eight_ball_leagues.hasMany(db.eight_ball_fixtures);

// //A fixture can only belong to one season
// db.eight_ball_fixtures.belongsTo(db.eight_ball_leagues);

// //A player can play in many fixtures
// db.eight_ball_leagues.hasMany(db.eight_ball_fixtures, {
//   foreignKey: "player1",
//   sourceKey: "staffName"
// });
// //A fixture can only belong to one season
// db.eight_ball_fixtures.belongsTo(db.eight_ball_leagues, {
//   foreignKey: "player1",
//   targetKey: "staffName",
// });

// //A player can play in many fixtures
// db.eight_ball_leagues.hasMany(db.eight_ball_fixtures, {
//   foreignKey: "player2",
//   sourceKey: "staffName"
// });
// //A fixture can only belong to one season
// db.eight_ball_fixtures.belongsTo(db.eight_ball_leagues, {
//   foreignKey: "player2",
//   targetKey: "staffName",
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
