module.exports = function(sequelize, DataTypes) {
    return sequelize.define('staff', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })
}