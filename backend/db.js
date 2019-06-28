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

db.eight_ball_league = sequelize.import(
  __dirname + "/models/eight_ball_league.js"
);
db.eight_ball_fixtures = sequelize.import(
  __dirname + "/models/eight_ball_fixtures.js"
);

//Association
//Each league season has many fixtures
db.eight_ball_league.hasMany(db.eight_ball_fixtures, {
  foreignKey: "seasonId",
  sourceKey: "seasonId"
});
//A fixture can only belong to one season
db.eight_ball_fixtures.belongsTo(db.eight_ball_league, {
  foreignKey: "seasonId",
  targetKey: "seasonId"
});

//A player can play in many fixtures
db.eight_ball_league.hasMany(db.eight_ball_fixtures, {
  foreignKey: "player1",
  sourceKey: "staffName"
});
//A fixture can only belong to one season
db.eight_ball_fixtures.belongsTo(db.eight_ball_league, {
  foreignKey: "player1",
  targetKey: "staffName"
});

//A player can play in many fixtures
db.eight_ball_league.hasMany(db.eight_ball_fixtures, {
  foreignKey: "player2",
  sourceKey: "staffName"
});
//A fixture can only belong to one season
db.eight_ball_fixtures.belongsTo(db.eight_ball_league, {
  foreignKey: "player2",
  targetKey: "staffName"
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
