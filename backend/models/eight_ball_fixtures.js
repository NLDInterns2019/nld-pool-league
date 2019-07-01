module.exports = function(sequelize, DataTypes) {
  return sequelize.define("eight_ball_fixtures", {
    seasonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    fixtureId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    score1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    player1: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    player2: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    score2: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });
};
