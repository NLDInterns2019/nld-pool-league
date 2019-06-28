module.exports = function(sequelize, DataTypes) {
  return sequelize.define("eight_ball_league", {
    seasonId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    staffName: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    played: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    win: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    draw: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    lost: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    goalsFor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    goalsAgainst: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });
};
