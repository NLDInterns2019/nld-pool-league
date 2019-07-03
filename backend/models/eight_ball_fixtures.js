module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "eight_ball_fixtures",
    {
      seasonId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      score1: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      player1: {
        type: DataTypes.STRING,
        allowNull: false
      },
      player2: {
        type: DataTypes.STRING,
        allowNull: false
      },
      score2: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["seasonId", "player1", "player2"]
        }
      ]
    }
  );
};
