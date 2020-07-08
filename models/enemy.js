module.exports = function(sequelize, DataTypes) {

    const Enemy = sequelize.define("Enemy", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        attack: {
            type: DataTypes.DOUBLE
        },
        health: {
            type: DataTypes.DOUBLE
        },
        is_grunt: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        is_boss: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return Enemy;

};