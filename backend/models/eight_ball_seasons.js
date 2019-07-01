module.exports = function(sequelize, DataTypes) {
    return sequelize.define("eight_ball_seasons", {
      seasonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      }
    });
  };